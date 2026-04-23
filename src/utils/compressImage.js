import imageCompression from "browser-image-compression";

export const compressImage = async (file, maxSizeKB, maxWidth) => {
  let quality = 0.8;
  let compressed = file;

  while (true) {
    const options = {
      maxSizeMB: maxSizeKB / 1024,
      maxWidthOrHeight: maxWidth,
      useWebWorker: true,
      initialQuality: quality,
    };

    compressed = await imageCompression(compressed, options);

    if (compressed.size / 1024 <= maxSizeKB || quality <= 0.2) {
      break;
    }

    quality -= 0.1;
  }

  return new File([compressed], file.name, {
    type: compressed.type,
  });
};