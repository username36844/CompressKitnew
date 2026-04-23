import ProgressBar from "./ProgressBar";

export default function FileGrid({ files, onRemove, onRename }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {files.map((item) => {
        const reduction =
          item.compressedSize &&
          ((1 - item.compressedSize / item.originalSize) * 100).toFixed(0);

        return (
          <div key={item.id} className="bg-neutral-900 p-3 rounded-xl">
            <img src={item.preview} className="h-32 w-full object-cover rounded" />

            <div className="mt-2 flex items-center gap-1">
              <input
                value={item.name}
                onChange={(e) => onRename(item.id, e.target.value)}
                className="w-full text-xs bg-neutral-800 rounded px-2 py-1"
              />
              <span className="text-xs text-neutral-400">
                .{item.extension}
              </span>
            </div>

            <p className="text-xs text-neutral-400 mt-1">
              {(item.originalSize / 1024).toFixed(1)} KB
            </p>

            {item.progress > 0 && <ProgressBar value={item.progress} />}

            {item.compressedSize && (
              <p className="text-xs text-green-400 mt-1">
                {(item.compressedSize / 1024).toFixed(1)} KB ({reduction}%)
              </p>
            )}

            <button
              onClick={() => onRemove(item.id)}
              className="text-xs text-red-400 mt-2"
            >
              Remove
            </button>
          </div>
        );
      })}
    </div>
  );
}