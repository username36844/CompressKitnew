import { useState } from "react";
import pLimit from "p-limit";

import getCroppedImage from "../src/utils/getCroppedImage";
import UploadArea from "../src/components/UploadArea";
import FileGrid from "../src/components/FileGrid";
import SettingsPanel from "../src/components/SettingsPanel";
import CropModal from "../src/components/CropModal";

import { processImage } from "../src/utils/processImage";
import { downloadZip } from "../src/utils/zipFiles";

export default function Home() {
  const [files, setFiles] = useState([]);

  const [isProcessing, setIsProcessing] = useState(false);

  const [cropTarget, setCropTarget] = useState(null);

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
      numbering: false,
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

        croppedPreview: null, // add this here

        processedFile: null,

        crop: null,

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
    setFiles((prev) =>
      prev.map((file) =>
        file.id === id
          ? {
              ...file,
              name,
            }
          : file,
      ),
    );
  };

  const saveCrop = async ({ crop }) => {
    try {
      const croppedBlob = await getCroppedImage(cropTarget.preview, crop);

      const croppedPreview = URL.createObjectURL(croppedBlob);

      setFiles((prev) =>
        prev.map((file) =>
          file.id === cropTarget.id
            ? {
                ...file,

                crop,

                croppedPreview,
              }
            : file,
        ),
      );
    } catch (error) {
      console.error("Preview crop failed", error);
    }

    setCropTarget(null);
  };

  /*
   * Compress one image
   */
  const compressSingle = async (id) => {
    const item = files.find((file) => file.id === id);

    if (!item) return;

    await runCompression(item, 0);
  };

  /*
   * Shared compression function
   */
  const runCompression = async (item, index) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === item.id
          ? {
              ...file,
              status: "processing",
              progress: 0,
            }
          : file,
      ),
    );

    try {
      const result = await processImage({
        item,

        index,

        settings,

        onProgress: (progress) => {
          setFiles((prev) =>
            prev.map((file) =>
              file.id === item.id
                ? {
                    ...file,
                    progress,
                  }
                : file,
            ),
          );
        },
      });

      setFiles((prev) =>
        prev.map((file) =>
          file.id === item.id
            ? {
                ...file,

                processedFile: result.file,

                compressedSize: result.compressedSize,

                status: "done",

                progress: 100,
              }
            : file,
        ),
      );

      return result.file;
    } catch (error) {
      console.error(error);

      setFiles((prev) =>
        prev.map((file) =>
          file.id === item.id
            ? {
                ...file,
                status: "error",
              }
            : file,
        ),
      );

      return null;
    }
  };

  /*
   * Compress all images
   */
  const compressImages = async () => {
    setIsProcessing(true);

    const limit = pLimit(3);

    await Promise.all(
      files.map((item, index) => limit(() => runCompression(item, index))),
    );

    setIsProcessing(false);
  };

  const downloadSingle = (file) => {
    if (!file.processedFile) return;

    const url = URL.createObjectURL(file.processedFile);

    const link = document.createElement("a");

    link.href = url;

    link.download = file.processedFile.name;

    link.click();

    URL.revokeObjectURL(url);
  };

  const downloadAll = async () => {
    const readyFiles = files

      .filter((file) => file.processedFile)

      .map((file) => file.processedFile);

    if (!readyFiles.length) return;

    await downloadZip(readyFiles);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold">CompressKit</h1>

          <p className="text-neutral-400 mt-2">
            Compress, crop and optimize images.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <UploadArea onFiles={addFiles} />

            {files.length === 0 ? (
              <div className="bg-neutral-900 rounded-xl p-10 text-center text-neutral-400">
                No images uploaded yet
              </div>
            ) : (
              <FileGrid
                files={files}
                onRemove={(id) =>
                  setFiles((prev) => prev.filter((file) => file.id !== id))
                }
                onRename={updateFileName}
                onCrop={(id) => {
                  const file = files.find((item) => item.id === id);

                  setCropTarget(file);
                }}
                onCompress={compressSingle}
                onDownload={downloadSingle}
              />
            )}
          </div>

          <SettingsPanel
            settings={settings}
            setSettings={setSettings}
            onProcess={compressImages}
            onDownload={downloadAll}
            disabled={!files.length || isProcessing}
          />
        </div>
      </div>

      <CropModal
        open={Boolean(cropTarget)}
        image={cropTarget}
        cropWidth={settings.crop.width}
        cropHeight={settings.crop.height}
        onClose={() => setCropTarget(null)}
        onSave={saveCrop}
      />
    </div>
  );
}
