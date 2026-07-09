import { useState, useCallback, useEffect } from "react";
import { X } from "lucide-react";
import Cropper from "react-easy-crop";

export default function CropModal({
  open,
  image,
  cropWidth,
  cropHeight,
  onClose,
  onSave,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(cropWidth / cropHeight);

  const cropRatios = [
    {
      label: "Free",
      value: null,
    },
    {
      label: "Square",
      value: 1,
    },
    {
      label: "4:3",
      value: 4 / 3,
    },
    {
      label: "16:9",
      value: 16 / 9,
    },
    {
      label: "3:2",
      value: 3 / 2,
    },
    {
      label: "9:16",
      value: 9 / 16,
    },
  ];

  useEffect(() => {
    if (open) {
      setCrop({
        x: 0,
        y: 0,
      });

      setZoom(1);

      setAspectRatio(cropWidth / cropHeight);

      setCroppedAreaPixels(null);
    }
  }, [open]);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels || !image) return;

    try {
      setLoading(true);

      onSave({
        crop: croppedAreaPixels,
      });
    } catch (err) {
      console.error(err);

      alert("Unable to crop image.");
    } finally {
      setLoading(false);
    }
  };

  if (!open || !image) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl rounded-2xl bg-neutral-900 overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Crop Image</h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
            aria-label="Close crop modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Crop Area */}
        <div className="relative h-150 bg-neutral-950">
          <Cropper
            image={image.preview}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            objectFit="contain"
            showGrid
          />
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-800 p-6 space-y-4">
          <div>
            <label className="text-sm text-neutral-300 block mb-2">
              Aspect Ratio
            </label>

            <div className="flex flex-wrap gap-2">
              {cropRatios.map((ratio) => (
                <button
                  key={ratio.label}
                  onClick={() => setAspectRatio(ratio.value)}
                  className={`
          px-3
          py-1.5
          rounded-lg
          text-xs
          ${
            aspectRatio === ratio.value
              ? "bg-blue-600 text-white"
              : "bg-neutral-800 text-neutral-300"
          }
        `}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-neutral-300 block mb-2">Zoom</label>

            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-neutral-700 text-white hover:bg-neutral-800"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Crop"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
