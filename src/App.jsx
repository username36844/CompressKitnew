import { useState } from "react";
import UploadArea from "../src/components/UploadArea";
import FileGrid from "../src/components/FileGrid";
import SettingsPanel from "../src/components/SettingsPanel";
import { compressImage } from "../src//utils/compressImage";
import { downloadZip } from "../src//utils/zipFiles";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [settings, setSettings] = useState({
    maxSize: 100,
    maxWidth: 1920,
  });

  const addFiles = (selected) => {
    const mapped = selected.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      originalSize: file.size,
      compressedSize: null,
    }));

    setFiles((prev) => [...prev, ...mapped]);
  };

  const removeFile = (id) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) URL.revokeObjectURL(file.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  const processImages = async () => {
    const results = [];

    for (let item of files) {
      const compressed = await compressImage(
        item.file,
        settings.maxSize,
        settings.maxWidth
      );

      results.push(compressed);

      setFiles((prev) =>
        prev.map((f) =>
          f.id === item.id
            ? { ...f, compressedSize: compressed.size }
            : f
        )
      );
    }

    await downloadZip(results);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        <h1 className="text-2xl mb-6">CompressKit</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <UploadArea onFiles={addFiles} />
            <FileGrid files={files} onRemove={removeFile} />
          </div>

          <SettingsPanel
            settings={settings}
            setSettings={setSettings}
            onProcess={processImages}
          />
        </div>
      </div>
    </div>
  );
}