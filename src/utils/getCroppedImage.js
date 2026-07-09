export default function getCroppedImage(imageSrc, pixelCrop) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const { x, y, width, height } = pixelCrop;

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to crop image."));
            return;
          }

          resolve(blob);
        },
        "image/jpeg",
        0.95,
      );
    };

    image.onerror = () => {
      reject(new Error("Failed to load image."));
    };
  });
}
