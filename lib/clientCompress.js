/**
 * Client-side image compression before upload (reduces payload & server memory).
 */
export async function compressImageFile(file, maxSize = 1200, quality = 0.8) {
  if (!file?.type?.startsWith("image/")) {
    throw new Error("Please select a valid image file.");
  }

  if (file.size > 15 * 1024 * 1024) {
    throw new Error("Image must be under 15MB.");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let blob = await new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), "image/webp", quality);
  });

  if (!blob) {
    blob = await new Promise((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Compression failed"))), "image/jpeg", quality);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read compressed image"));
    reader.readAsDataURL(blob);
  });
}
