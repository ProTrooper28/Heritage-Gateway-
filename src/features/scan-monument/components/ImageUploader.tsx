import { useState } from "react";
import { Upload } from "lucide-react";

type Props = {
  onImageSelected: (dataUrl: string) => void;
};

export function ImageUploader({ onImageSelected }: Props) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    // Max 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      alert("Maximum file size is 10MB. Please select a smaller photo.");
      return;
    }

    // Supported formats: JPG, JPEG, PNG, WEBP
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowed.includes(file.type.toLowerCase())) {
      alert("Supported formats are JPG, JPEG, PNG, and WEBP.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        onImageSelected(evt.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={() => document.getElementById("standalone-file-input")?.click()}
      className={`relative h-[320px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all duration-300 bg-ink/30 backdrop-blur-sm hover:bg-ink/50 ${
        dragActive ? "border-gold bg-gold/5" : "border-parchment/15 hover:border-gold/40"
      }`}
    >
      <input
        id="standalone-file-input"
        type="file"
        className="hidden"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileChange}
      />

      <div className="w-16 h-16 rounded-full border border-parchment/10 bg-parchment/4 flex items-center justify-center text-parchment/40 mb-5 hover:text-gold transition">
        <Upload size={22} className="animate-bounce" style={{ animationDuration: "2.5s" }} />
      </div>

      <p className="font-sans text-sm font-medium text-parchment/80 mb-2">
        Drag and drop your monument photo here
      </p>

      <p className="font-sans text-xs text-gold/75 mb-6">
        or click to browse files on your device
      </p>

      <div className="flex gap-8 text-[0.62rem] uppercase tracking-wider text-parchment/35 border-t border-parchment/10 pt-4 w-full justify-center max-w-sm font-sans">
        <span>Max size: 10MB</span>
        <span>•</span>
        <span>JPG, JPEG, PNG, WEBP</span>
      </div>
    </div>
  );
}
