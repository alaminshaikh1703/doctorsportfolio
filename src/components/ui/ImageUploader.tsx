"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, ImageIcon, CheckCircle2, RefreshCw, X } from "lucide-react";
import { DEFAULT_BLUR_DATA_URL } from "../../lib/imagePlaceholders";

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  description?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  description,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.url) {
        onChange(data.url);
      } else {
        setError(data.error || "Upload failed. Please try again.");
      }
    } catch (err) {
      setError("Network error uploading image file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2.5 w-full">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
        {label}
      </label>

      {/* Main Upload Box & Preview */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
        {/* Thumbnail Preview */}
        <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300 flex items-center justify-center">
          {value ? (
            <Image
              src={value}
              alt="Image Preview"
              fill
              sizes="80px"
              placeholder="blur"
              blurDataURL={DEFAULT_BLUR_DATA_URL}
              className="object-cover"
            />
          ) : (
            <ImageIcon className="w-8 h-8 text-slate-400" />
          )}
        </div>

        {/* Upload Action Area */}
        <div className="flex flex-col gap-2 flex-1 w-full">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml, image/gif"
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Uploading Image...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload Image File (JPG, PNG, WebP)</span>
                </>
              )}
            </button>

            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="p-2 rounded-xl bg-slate-200 hover:bg-red-100 text-slate-600 hover:text-red-600 transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Or enter image URL path..."
              className="w-full bg-white text-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono border border-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {error && <span className="text-xs text-red-600 font-semibold">{error}</span>}
          {description && <span className="text-xs text-slate-500">{description}</span>}
        </div>
      </div>
    </div>
  );
};
