export default function SettingsPanel({ settings, setSettings, onProcess }) {
  return (
    <div className="bg-neutral-900 p-6 rounded-2xl sticky top-6">
      <h2 className="text-lg font-medium mb-6">Compression Settings</h2>

      <div className="space-y-5">
        {/* Max Size */}
        <div>
          <label
            htmlFor="maxSize"
            className="block text-sm text-neutral-400 mb-1"
          >
            Max File Size (KB)
          </label>
          <input
            id="maxSize"
            type="number"
            value={settings.maxSize}
            onChange={(e) =>
              setSettings({
                ...settings,
                maxSize: Number(e.target.value),
              })
            }
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white"
          />
        </div>

        {/* Max Width */}
        <div>
          <label
            htmlFor="maxWidth"
            className="block text-sm text-neutral-400 mb-1"
          >
            Max Width (px)
          </label>
          <input
            id="maxWidth"
            type="number"
            value={settings.maxWidth}
            onChange={(e) =>
              setSettings({
                ...settings,
                maxWidth: Number(e.target.value),
              })
            }
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white"
          />
        </div>

        {/* Action */}
        <button
          onClick={onProcess}
          className="w-full mt-2 bg-white text-black py-2.5 rounded-lg text-sm font-medium hover:bg-neutral-200 transition"
        >
          Compress & Download
        </button>
      </div>
    </div>
  );
}
