import imageCompression from "browser-image-compression";

export const compressImage = async (
  file,
  { maxSize, maxWidth, format },
  onProgress
) => {
  let quality = 0.8;
  let compressed = file;

  const targetType =
    format === "auto" ? file.type : `image/${format}`;

  while (true) {
    const options = {
      maxSizeMB: maxSize / 1024,
      maxWidthOrHeight: maxWidth,
      useWebWorker: true,
      initialQuality: quality,
      fileType: targetType,
      onProgress,
    };

    compressed = await imageCompression(compressed, options);

    if (compressed.size / 1024 <= maxSize || quality <= 0.2) {
      break;
    }

    quality -= 0.1;
  }

  return compressed;
};