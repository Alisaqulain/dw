import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { put, del } from "@vercel/blob";

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const WEBP_QUALITY = 78;

function isVercelHost() {
  return process.env.VERCEL === "1";
}

function productionUploadHelp() {
  return (
    "On Vercel, connect a Blob store: Dashboard → your project → Storage → Create → Blob → Connect to project, then redeploy. " +
    "Vercel adds BLOB_READ_WRITE_TOKEN automatically."
  );
}

function parseBase64Image(base64Data) {
  const match = base64Data.match(/^data:(image\/[\w+.-]+);base64,(.+)$/);
  if (match) {
    return {
      mime: match[1],
      buffer: Buffer.from(match[2], "base64"),
    };
  }
  return {
    mime: "image/jpeg",
    buffer: Buffer.from(base64Data.replace(/^data:.*;base64,/, ""), "base64"),
  };
}

export async function compressImageBuffer(buffer) {
  const compressed = await sharp(buffer)
    .rotate()
    .resize(MAX_WIDTH, MAX_HEIGHT, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer();

  const meta = await sharp(compressed).metadata();

  return {
    buffer: compressed,
    contentType: "image/webp",
    width: meta.width,
    height: meta.height,
    size: compressed.length,
  };
}

function buildFilename() {
  const stamp = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  return `products/${stamp}-${rand}.webp`;
}

async function uploadToLocal(buffer) {
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), buffer);
  return {
    url: `/uploads/products/${filename}`,
    publicId: filename,
    storage: "local",
  };
}

async function uploadToVercelBlob(buffer, contentType) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;

  const pathname = buildFilename();
  const blob = await put(pathname, buffer, {
    access: "public",
    contentType,
    token,
    addRandomSuffix: false,
  });

  return {
    url: blob.url,
    publicId: blob.pathname || pathname,
    storage: "vercel-blob",
  };
}

export async function storeImage(base64Data) {
  const { buffer: originalBuffer } = parseBase64Image(base64Data);
  const originalSize = originalBuffer.length;

  if (originalSize > 15 * 1024 * 1024) {
    throw new Error("Image too large. Maximum 15MB before compression.");
  }

  const { buffer, contentType, width, height, size: compressedSize } =
    await compressImageBuffer(originalBuffer);

  let result = null;
  let blobError = null;

  try {
    result = await uploadToVercelBlob(buffer, contentType);
  } catch (err) {
    blobError = err.message;
    console.error("Vercel Blob upload failed:", err.message);
  }

  if (!result && !isVercelHost()) {
    result = await uploadToLocal(buffer);
  }

  if (!result) {
    if (isVercelHost()) {
      throw new Error(blobError ? `${productionUploadHelp()} (${blobError})` : productionUploadHelp());
    }
    throw new Error(
      "Image upload failed. For local dev, files save to /public/uploads. On Vercel, connect a Blob store."
    );
  }

  return {
    ...result,
    width,
    height,
    format: "webp",
    originalSize,
    compressedSize,
    savedPercent: Math.round((1 - compressedSize / originalSize) * 100),
  };
}

export async function removeStoredImage(publicId, storage) {
  if (!publicId) return;

  if (storage === "local" && !isVercelHost()) {
    try {
      const filePath = path.join(process.cwd(), "public", "uploads", "products", publicId);
      await fs.unlink(filePath);
    } catch {
      // file may already be gone
    }
    return;
  }

  if (storage === "vercel-blob" || publicId.startsWith("products/")) {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (token) {
      try {
        await del(publicId, { token });
      } catch {
        // ignore delete errors
      }
    }
  }
}
