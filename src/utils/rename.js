export const buildFileName = (item, index, renameOptions) => {
  const base = item.name || "image";

  let finalName = base;

  if (renameOptions.prefix) {
    finalName = renameOptions.prefix + finalName;
  }

  if (renameOptions.suffix) {
    finalName = finalName + renameOptions.suffix;
  }

  if (renameOptions.numbering) {
    finalName = `${finalName}-${String(index + 1).padStart(2, "0")}`;
  }

  return `${finalName}.${item.extension}`;
};