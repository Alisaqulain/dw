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

function canUseBlob() {
  return isVercelHost() || Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function productionUploadHelp() {
  return (
    "Connect your Blob store to this project: Vercel → Storage → your Blob → Connect to Project → choose this app → Redeploy. " +
    "Then confirm BLOB_READ_WRITE_TOKEN appears under Project → Settings → Environment Variables."
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

/** Same pattern as Vercel Blob quickstart — token is read from BLOB_READ_WRITE_TOKEN automatically. */
async function uploadToVercelBlob(buffer, contentType) {
  const pathname = buildFilename();
  const { url, pathname: blobPath } = await put(pathname, buffer, {
    access: "public",
    contentType,
    addRandomSuffix: false,
  });

  return {
    url,
    publicId: blobPath || pathname,
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

  if (canUseBlob()) {
    try {
      result = await uploadToVercelBlob(buffer, contentType);
    } catch (err) {
      blobError = err.message;
      console.error("Vercel Blob upload failed:", err.message);
    }
  }

  if (!result && !isVercelHost()) {
    result = await uploadToLocal(buffer);
  }

  if (!result) {
    if (isVercelHost()) {
      throw new Error(blobError ? `${productionUploadHelp()} (${blobError})` : productionUploadHelp());
    }
    throw new Error(
      "Image upload failed locally. Files save to /public/uploads, or add BLOB_READ_WRITE_TOKEN to .env.local for Blob."
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
    try {
      await del(publicId);
    } catch {
      // ignore delete errors
    }
  }
}
