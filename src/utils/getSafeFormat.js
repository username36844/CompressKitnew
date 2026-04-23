export const getSafeFormat = (originalExt, selectedFormat) => {
  const ext = originalExt.toLowerCase();

  // DEFAULT: WEBP
  if (selectedFormat === "webp") {
    return "webp";
  }

  // AUTO (fallback logic)
  if (selectedFormat === "auto") {
    if (ext === "png") return "webp";
    if (ext === "jpeg" || ext === "jpg") return "jpeg";
    if (ext === "webp") return "webp";
    return "webp"; // fallback everything else
  }

  // SAFETY: prevent bad conversion
  if (ext === "png" && selectedFormat === "jpeg") {
    return "webp";
  }

  return selectedFormat;
};