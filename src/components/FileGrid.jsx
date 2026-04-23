export default function FileGrid({ files, onRemove, onRename }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {files.map((item) => (
        <div key={item.id} className="bg-neutral-900 p-3 rounded-xl">
          <img
            src={item.preview}
            className="w-full h-32 object-cover rounded-md"
          />

          {/* Editable Name */}
          <div className="mt-2 flex items-center gap-1">
            <input
              value={item.name}
              onChange={(e) => onRename(item.id, e.target.value)}
              className="w-full text-xs bg-neutral-800 border border-neutral-700 rounded px-2 py-1 focus:outline-none"
            />
            <span className="text-xs text-neutral-400">.{item.extension}</span>
          </div>

          <p className="text-xs text-neutral-400 mt-1">
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
