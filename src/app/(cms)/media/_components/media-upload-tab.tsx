"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useUploadMedia } from "@/hooks/media/use-media";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/webm",
  "application/pdf",
];

interface MediaUploadTabProps {
  onUploadSuccess: () => void;
}

export function MediaUploadTab({ onUploadSuccess }: MediaUploadTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploading, uploadFiles } = useUploadMedia(onUploadSuccess);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounterRef = useRef(0);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) {
      await uploadFiles(files);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current = 0;
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      ALLOWED_MIME_TYPES.includes(file.type),
    );

    if (files.length > 0) {
      await uploadFiles(files);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current += 1;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  };

  return (
    <div className="flex-1">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`
          border-2 p-6 h-[500px] border-dashed rounded-xl
          flex flex-col items-center justify-center space-y-4
          transition-all duration-200
          ${
            isDragging
              ? "border-foreground bg-foreground/10 scale-[1.01]"
              : "border-muted-foreground/30"
          }
        `}
      >
        <Upload
          className={`w-12 h-12 transition-all duration-200 ${
            isDragging ? "text-white scale-110" : "text-muted-foreground"
          }`}
        />
        <p
          className={`text-lg font-medium transition-colors duration-200 ${
            isDragging ? "text-white" : ""
          }`}
        >
          {uploading
            ? "Uploading..."
            : isDragging
              ? "Release to upload"
              : "Drag and drop or click to upload"}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,video/mp4,video/webm,application/pdf"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || isDragging}
          variant={isDragging ? "outline" : "outline"}
          className="transition-all duration-200"
        >
          {uploading ? "Uploading..." : "Choose a file"}
        </Button>
      </div>
    </div>
  );
}
