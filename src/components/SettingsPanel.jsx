export default function SettingsPanel({
  settings,
  setSettings,
  onProcess,
  hasFiles,
}) {
  return (
    <div className="bg-neutral-900 p-6 rounded-2xl sticky top-6">
      <h2 className="text-lg font-medium mb-6">Compression Settings</h2>

      <div className="space-y-5">
        {/* Max Size */}
        <div>
          <label className="block text-sm text-neutral-400 mb-1">
            Max File Size (KB)
          </label>
          <input
            type="number"
            value={settings.maxSize}
            onChange={(e) =>
              setSettings({
                ...settings,
                maxSize: Number(e.target.value),
              })
            }
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* Max Width */}
        <div>
          <label className="block text-sm text-neutral-400 mb-1">
            Max Width (px)
          </label>
          <input
            type="number"
            value={settings.maxWidth}
            onChange={(e) =>
              setSettings({
                ...settings,
                maxWidth: Number(e.target.value),
              })
            }
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={onProcess}
          disabled={!hasFiles}
          className={`w-full py-2.5 rounded-lg text-sm font-medium transition
            ${
              hasFiles
                ? "bg-white text-black hover:bg-neutral-200"
                : "bg-neutral-700 text-neutral-400 cursor-not-allowed"
            }`}
        >
          Compress & Download
        </button>
      </div>
    </div>
  );
}
