import {
  Crop,
  Download,
  Trash2,
  Minimize2,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import ProgressBar from "./ProgressBar";

export default function FileGrid({
  files,
  onRemove,
  onRename,
  onCrop,
  onDownload,
  onCompress,
}) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {files.map((item) => {
        const reduction =
          item.compressedSize &&
          ((1 - item.compressedSize / item.originalSize) * 100).toFixed(0);

        return (
          <div
            key={item.id}
            className=" relative bg-neutral-900 p-3 rounded-xl flex flex-col gap-2"
          >
            <div className="relative aspect-video overflow-hidden rounded-xl bg-neutral-800">
              <img
                src={item.croppedPreview || item.preview}
                alt={item.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

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

            <p className="text-xs text-neutral-400">
              Original: {(item.originalSize / 1024).toFixed(1)}
              KB
            </p>

            {item.progress > 0 && <ProgressBar value={item.progress} />}

            <div className="flex gap-4 flex-wrap items-center justify-between mb-1">
              {item.compressedSize && (
                <div className="flex items-center gap-2">
                  <p className="text-xs text-green-400 mt-1">
                    Compressed: {(item.compressedSize / 1024).toFixed(1)}
                    KB ({reduction}% saved)
                  </p>
                </div>
              )}

              {item.status === "done" && (
                <div className="flex items-center gap-1 text-xs text-green-400 mt-2">
                  <CheckCircle2 size={13} />
                  Ready
                </div>
              )}

              {item.status === "processing" && (
                <div className="flex items-center gap-1 text-xs text-yellow-400 mt-2">
                  <Loader2 size={8} className="animate-spin" />
                  Processing...
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-auto">
              <button
                title="Crop image"
                onClick={() => onCrop(item.id)}
                className="flex-1 flex items-center justify-center gap-1 text-xs px-2 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700"
              >
                <Crop size={14} />
                Crop
              </button>

              <button
                title="Compress image"
                onClick={() => onCompress(item.id)}
                disabled={item.status === "processing"}
                className="flex-1 flex items-center justify-center gap-1 text-xs px-2 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                <Minimize2 size={14} />
                Compress
              </button>

              {item.processedFile && (
                <button
                  title="Download image"
                  onClick={() => onDownload(item)}
                  className="flex-1 flex items-center justify-center gap-1 text-xs px-2 py-2 rounded-lg bg-green-600 hover:bg-green-700"
                >
                  <Download size={14} />
                  Download
                </button>
              )}
            </div>

            <button
              title="Remove image"
              onClick={() => onRemove(item.id)}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 absolute top-6 right-6 bg-neutral-900 p-2 rounded-md"
            >
              <Trash2 size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
