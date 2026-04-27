import { useState } from "react";
import pLimit from "p-limit";
import UploadArea from "../src/components/UploadArea";
import FileGrid from "../src/components/FileGrid";
import SettingsPanel from "../src/components/SettingsPanel";
import { compressImage } from "../src/utils/compressImage";
import { downloadZip } from "../src/utils/zipFiles";
import { buildFileName } from "../src/utils/rename";
import { getSafeFormat } from "./utils/getSafeFormat";
import { cropImageToCover } from "./utils/cropImage";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const [settings, setSettings] = useState({
    maxSize: 100,
    maxWidth: 1920,
    format: "webp",
    crop: {
      enabled: false,
      width: 800,
      height: 500,
    },
    rename: {
      prefix: "",
      suffix: "",
      numbering: true,
    },
  });

  const addFiles = (selected) => {
    const mapped = selected.map((file) => {
      const name = file.name.replace(/\.[^/.]+$/, "");
      const extension = file.name.split(".").pop();

      return {
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        originalSize: file.size,
        compressedSize: null,
        progress: 0,
        name,
        extension,
        status: "idle",
      };
    });

    setFiles((prev) => [...prev, ...mapped]);
  };

  const updateFileName = (id, name) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f)));
  };

  const processImages = async () => {
    setIsProcessing(true);

    const limit = pLimit(3);

    const results = await Promise.all(
      files.map((item, index) =>
        limit(async () => {
          // 1. mark processing
          setFiles((prev) =>
            prev.map((f) =>
              f.id === item.id
                ? { ...f, status: "processing", progress: 0 }
                : f,
            ),
          );

          try {
            // 2. resolve safe format
            const safeFormat = getSafeFormat(item.extension, settings.format);

            // 3. decide input file (crop or original)
            let inputFile = item.file;

            if (settings.crop?.enabled) {
              const croppedBlob = await cropImageToCover(
                item.file,
                settings.crop.width,
                settings.crop.height,
              );

              inputFile = new File([croppedBlob], item.file.name, {
                type: "image/jpeg", // temp format for processing
              });
            }

            // 4. compress (with progress)
            const compressed = await compressImage(
              inputFile,
              { ...settings, format: safeFormat },
              (progress) => {
                setFiles((prev) =>
                  prev.map((f) => (f.id === item.id ? { ...f, progress } : f)),
                );
              },
            );

            // 5. fix extension
            const outputExt =
              settings.format === "auto" ? item.extension : safeFormat;

            // 6. build filename
            const fileName = buildFileName(
              { ...item, extension: outputExt },
              index,
              settings.rename,
            );

            // 7. create final file
            const finalFile = new File([compressed], fileName, {
              type: compressed.type,
            });

            // 8. update UI
            setFiles((prev) =>
              prev.map((f) =>
                f.id === item.id
                  ? {
                      ...f,
                      compressedSize: compressed.size,
                      status: "done",
                      progress: 100,
                    }
                  : f,
              ),
            );

            return finalFile;
          } catch (err) {
            // error handling (important for production feel)
            setFiles((prev) =>
              prev.map((f) =>
                f.id === item.id ? { ...f, status: "error" } : f,
              ),
            );

            return null;
          }
        }),
      ),
    );

    // remove failed ones
    const validFiles = results.filter(Boolean);

    if (validFiles.length) {
      await downloadZip(validFiles);
    }

    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight">CompressKit</h1>
          <p className="text-neutral-400 mt-2">
            Bulk compress images with full control over size and format.
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            <UploadArea onFiles={addFiles} />

            {files.length === 0 ? (
              <div className="bg-neutral-900 rounded-2xl p-10 text-center text-neutral-400">
                No images uploaded yet
              </div>
            ) : (
              <FileGrid
                files={files}
                onRemove={(id) =>
                  setFiles((prev) => prev.filter((f) => f.id !== id))
                }
                onRename={updateFileName}
              />
            )}
          </div>

          {/* RIGHT SIDE */}
          <SettingsPanel
            settings={settings}
            setSettings={setSettings}
            onProcess={processImages}
            disabled={!files.length || isProcessing}
          />
        </div>
      </div>
    </div>
  );
}
