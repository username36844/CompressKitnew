import { compressImage } from "./compressImage";
import { buildFileName } from "./rename";
import { getSafeFormat } from "./getSafeFormat";
import getCroppedImage from "./getCroppedImage";

export async function processImage({ item, index, settings, onProgress }) {
  const safeFormat = getSafeFormat(item.extension, settings.format);

  let inputFile = item.file;

  /*
   * Apply custom crop
   */
  if (item.crop) {
    const croppedBlob = await getCroppedImage(item.preview, item.crop);

    inputFile = new File([croppedBlob], item.name + ".jpg", {
      type: "image/jpeg",
    });
  }

  /*
   * Compress image
   */
  const compressed = await compressImage(
    inputFile,
    {
      ...settings,
      format: safeFormat,
    },
    onProgress,
  );

  /*
   * Final extension
   */
  const outputExt = settings.format === "auto" ? item.extension : safeFormat;

  /*
   * Build renamed filename
   */
  const fileName = buildFileName(
    {
      ...item,
      extension: outputExt,
    },
    index,
    settings.rename,
  );

  /*
   * Create final downloadable file
   */
  const finalFile = new File([compressed], fileName, {
    type: compressed.type,
  });

  return {
    file: finalFile,

    compressedSize: compressed.size,
  };
}
