"use client";

import { useState, useRef, useCallback } from "react";
import {
  Upload,
  CheckCircle2,
  AlertTriangle,
  X,
  Loader2,
  Image,
} from "lucide-react";

const MAX_SIZE = 500 * 1024; // 500kb

interface ImageUploadProps {
  onUpload?: (file: File) => Promise<void>;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploaded, setUploaded] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndProcess = useCallback((file: File) => {
    setError(null);
    setUploaded(false);

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    if (file.size > MAX_SIZE) {
      setError(
        `File too large. Max size is 500KB (yours: ${(file.size / 1024).toFixed(0)}KB)`,
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    handleUpload(file);
  }, []);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      await onUpload?.(file);
      setUploaded(true);
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) validateAndProcess(file);
    },
    [validateAndProcess],
  );

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) validateAndProcess(e.target.files[0]);
  };

  const reset = () => {
    setPreview(null);
    setError(null);
    setUploaded(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const dropZoneClasses = [
    "relative grow-1 flex flex-col items-center justify-center gap-4 w-full rounded-lg border-muted border-2 border-dashed px-12 py-6 text-center cursor-pointer transition-colors duration-200",
    isDragging
      ? "border-blue-500 bg-[var(--primary)]"
      : uploaded
        ? "border-green-500 bg-green-50"
        : error
          ? "border-red-400 bg-red-50"
          : "border-gray-300 hover:border-gray-400",
  ].join(" ");

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full space-y-3">
        {/* Drop Zone */}
        <div
          className={dropZoneClasses}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => !preview && inputRef.current?.click()}
        >
          {/* Icon */}
          <div
            className={`rounded-full border-2 p-3 transition-colors duration-200 ${
              isDragging
                ? "border-blue-300"
                : uploaded
                  ? "border-green-300"
                  : error
                    ? "border-red-300"
                    : "border-gray-300"
            }`}
          >
            {uploaded ? (
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            ) : error ? (
              <AlertTriangle className="h-6 w-6 text-red-400" />
            ) : uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            ) : isDragging ? (
              <Image className="h-6 w-6 text-blue-500" />
            ) : (
              <Upload className="h-6 w-6 text-gray-400" />
            )}
          </div>

          {/* Text */}
          <div className="space-y-1 pointer-events-none">
            <p
              className={`text-sm font-semibold transition-colors duration-200 ${
                isDragging
                  ? "text-blue-600"
                  : uploaded
                    ? "text-green-600"
                    : error
                      ? "text-red-500"
                      : "text-gray-600"
              }`}
            >
              {uploaded
                ? "Upload complete"
                : uploading
                  ? "Uploading..."
                  : isDragging
                    ? "Drop it here"
                    : error
                      ? "Try again"
                      : "Drag & drop your image"}
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, WEBP — max 500KB</p>
          </div>

          {/* Browse button */}
          {!preview && (
            <button
              className="pointer-events-auto rounded border border-gray-300 bg-white px-4 py-1.5 text-xs font-medium text-gray-600 transition hover:border-gray-400 hover:text-gray-800"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              Browse files
            </button>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2">
            <X className="h-3.5 w-3.5 shrink-0 text-red-500" />
            <span className="text-xs text-red-600">{error}</span>
          </div>
        )}

        {/* Preview */}
        {preview && (
          <div className="relative overflow-hidden rounded-lg border border-gray-200">
            <img
              src={preview}
              alt="Preview"
              className="h-48 w-full object-cover brightness-90"
            />
            <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/60 to-transparent p-3">
              <span
                className={`text-xs font-medium uppercase tracking-wider ${uploading ? "text-yellow-300" : "text-green-400"}`}
              >
                {uploading ? "Uploading..." : uploaded ? "✓ Uploaded" : ""}
              </span>
              <button
                onClick={reset}
                className="flex items-center gap-1 rounded border border-white/20 bg-black/40 px-2 py-1 text-xs text-white/80 transition hover:bg-black/60 hover:text-white"
              >
                <X className="h-3 w-3" />
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
