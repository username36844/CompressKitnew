export default function SettingsPanel({
  settings,
  setSettings,
  onProcess,
  disabled,
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
                maxSize: +e.target.value,
              })
            }
            className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded-lg"
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
                maxWidth: +e.target.value,
              })
            }
            className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded-lg"
          />
        </div>

        {/* Format */}
        <div>
          <label className="block text-sm text-neutral-400 mb-1">
            Output Format
          </label>
          <select
            value={settings.format}
            onChange={(e) =>
              setSettings({ ...settings, format: e.target.value })
            }
            className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded-lg"
          >
            <option value="webp">WebP (recommended)</option>
            <option value="auto">Auto</option>
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
          </select>
        </div>

        {/* Prefix Rename */}
        <div>
          <label className="block text-sm text-neutral-400 mb-1">
            File Name Prefix
          </label>
          <input
            placeholder="e.g. project_"
            onChange={(e) =>
              setSettings({
                ...settings,
                rename: {
                  ...settings.rename,
                  prefix: e.target.value,
                },
              })
            }
            className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded-lg"
          />
        </div>

        {/* Action */}
        <button
          onClick={onProcess}
          disabled={disabled}
          className="w-full mt-2 bg-white text-black py-2.5 rounded-lg font-medium disabled:opacity-40"
        >
          Compress & Download
        </button>
      </div>
    </div>
  );
}
