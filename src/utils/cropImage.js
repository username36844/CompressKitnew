export const cropImageToCover = (file, width, height) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = width;
      canvas.height = height;

      const imgRatio = img.width / img.height;
      const targetRatio = width / height;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (imgRatio > targetRatio) {
        // image is wider → crop sides
        drawHeight = height;
        drawWidth = img.width * (height / img.height);
        offsetX = -(drawWidth - width) / 2;
        offsetY = 0;
      } else {
        // image is taller → crop top/bottom
        drawWidth = width;
        drawHeight = img.height * (width / img.width);
        offsetX = 0;
        offsetY = -(drawHeight - height) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("Crop failed");
          resolve(blob);
        },
        "image/jpeg", // temp format
        0.95
      );
    };

    img.onerror = reject;
  });
};