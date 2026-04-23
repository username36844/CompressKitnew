export const getSafeFormat = (originalExt, selectedFormat) => {
  const ext = originalExt.toLowerCase();

  // AUTO MODE (smart)
  if (selectedFormat === "auto") {
    if (ext === "png") return "webp";
    if (ext === "jpeg" || ext === "jpg") return "jpeg";
    if (ext === "webp") return "webp";
    return ext;
  }

  // SAFETY RULE
  if (ext === "png" && selectedFormat === "jpeg") {
    return "webp";
  }

  return selectedFormat;
};