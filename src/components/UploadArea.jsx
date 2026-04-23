import { useRef } from "react";

export default function UploadArea({ onFiles }) {
  const inputRef = useRef();

  const handleFiles = (files) => {
    onFiles(Array.from(files));
  };

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDrop={(e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
      }}
      onDragOver={(e) => e.preventDefault()}
      className="border border-dashed border-neutral-700 rounded-2xl p-12 text-center cursor-pointer hover:border-neutral-500 transition"
    >
      <p className="text-lg">Drag & drop images</p>
      <p className="text-sm text-neutral-400">or click to upload</p>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}