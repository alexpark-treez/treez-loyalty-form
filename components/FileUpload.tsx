"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { MAX_FILE_SIZE, ImageDimensions, imageDimensionRequirements } from "@/lib/schema";
import Image from "next/image";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  value: File | null;
  accept?: Record<string, string[]>;
  maxSize?: number;
  helperText?: string;
  imageType: "logo" | "icon" | "backgroundImage";
  required?: boolean;
  error?: string;
}

export function FileUpload({
  onFileSelect,
  value,
  accept = { "image/png": [".png"] },
  maxSize = MAX_FILE_SIZE,
  helperText,
  imageType,
  required = false,
  error,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dimensionWarning, setDimensionWarning] = useState<string | null>(null);
  const [isValidDimensions, setIsValidDimensions] = useState(false);

  const validateImageDimensions = useCallback(
    (file: File): Promise<ImageDimensions> => {
      return new Promise((resolve, reject) => {
        const img = document.createElement("img");
        img.onload = () => {
          URL.revokeObjectURL(img.src);
          resolve({ width: img.width, height: img.height });
        };
        img.onerror = () => {
          URL.revokeObjectURL(img.src);
          reject(new Error("Failed to load image"));
        };
        img.src = URL.createObjectURL(file);
      });
    },
    []
  );

  const checkDimensions = useCallback(
    async (file: File) => {
      try {
        const dims = await validateImageDimensions(file);
        const req = imageDimensionRequirements[imageType];

        if (imageType === "logo") {
          if (dims.width < req.minWidth! || dims.height < req.minHeight!) {
            setDimensionWarning(
              `Image is ${dims.width}×${dims.height}px. Minimum recommended: ${req.label}`
            );
            setIsValidDimensions(false);
          } else {
            setDimensionWarning(null);
            setIsValidDimensions(true);
          }
        } else {
          if (dims.width !== req.width || dims.height !== req.height) {
            setDimensionWarning(
              `Image is ${dims.width}×${dims.height}px. Recommended: ${req.label}`
            );
            setIsValidDimensions(false);
          } else {
            setDimensionWarning(null);
            setIsValidDimensions(true);
          }
        }
      } catch {
        setDimensionWarning("Failed to validate image dimensions");
        setIsValidDimensions(false);
      }
    },
    [imageType, validateImageDimensions]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Simulate upload progress
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 20;
        });
      }, 100);

      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Validate dimensions
      await checkDimensions(file);

      onFileSelect(file);
    },
    [onFileSelect, checkDimensions]
  );

  const removeFile = useCallback(() => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setUploadProgress(0);
    setDimensionWarning(null);
    setIsValidDimensions(false);
    onFileSelect(null);
  }, [preview, onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  const fileError = fileRejections[0]?.errors[0]?.message;

  return (
    <div className="space-y-2">
      {!value ? (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors",
            "hover:border-primary hover:bg-primary/5",
            isDragActive && "border-primary bg-primary/5",
            (error || fileError) && "border-destructive",
            "flex flex-col items-center justify-center text-center"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm font-medium">
            {isDragActive ? "Drop the file here" : "Drag & drop or click to upload"}
          </p>
          {helperText && (
            <p className="text-xs text-muted-foreground mt-1">{helperText}</p>
          )}
        </div>
      ) : (
        <div className="border rounded-lg p-4 space-y-3">
          {uploadProgress < 100 ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Uploading...</p>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          ) : (
            <>
              <div className="flex items-start gap-4">
                {preview && (
                  <div className="relative w-24 h-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={preview}
                      alt="Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{value.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(value.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {dimensionWarning ? (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3 text-amber-500" />
                      <p className="text-xs text-amber-600">{dimensionWarning}</p>
                    </div>
                  ) : isValidDimensions ? (
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      <p className="text-xs text-green-600">Dimensions look good!</p>
                    </div>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-1 hover:bg-muted rounded-md transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {(error || fileError) && (
        <p className="text-sm text-destructive">{error || fileError}</p>
      )}

      {required && !value && !error && (
        <p className="text-xs text-muted-foreground">Required</p>
      )}
    </div>
  );
}
