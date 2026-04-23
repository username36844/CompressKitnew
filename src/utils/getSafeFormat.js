export const getSafeFormat = (originalExt, selectedFormat) => {
  if (selectedFormat === "auto") return originalExt;

  // Normalize
  const ext = originalExt.toLowerCase();

  // PNG safety rule (avoid JPEG)
  if (ext === "png" && selectedFormat === "jpeg") {
    return "webp"; // fallback
  }

  // Otherwise safe
  return selectedFormat;
};