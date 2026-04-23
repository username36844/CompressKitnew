export default function FileGrid({ files, onRemove }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {files.map((item) => (
        <div key={item.id} className="bg-neutral-900 p-3 rounded-xl">
          <img
            src={item.preview}
            className="w-full h-32 object-cover rounded-md"
          />

          <p className="text-xs mt-2 truncate">{item.file.name}</p>

          <p className="text-xs text-neutral-400">
            {(item.originalSize / 1024).toFixed(1)} KB
          </p>

          {item.compressedSize && (
            <p className="text-xs text-green-400">
              → {(item.compressedSize / 1024).toFixed(1)} KB
            </p>
          )}

          <button
            onClick={() => onRemove(item.id)}
            className="text-xs text-red-400 mt-2"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}