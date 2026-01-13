"use client";

import { Input } from "@/components/ui/input";

interface ColorInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ColorInput({ value, onChange, placeholder = "#000000" }: ColorInputProps) {
  // Ensure hex value starts with #
  const normalizeHex = (hex: string) => {
    if (!hex) return "";
    if (!hex.startsWith("#")) {
      return `#${hex}`;
    }
    return hex;
  };

  const displayValue = value || "";
  const colorPreview = normalizeHex(value) || "#FFFFFF";

  return (
    <div className="flex items-center gap-3">
      <div
        className="w-12 h-10 rounded-md border border-input flex-shrink-0"
        style={{ backgroundColor: colorPreview }}
      />
      <Input
        value={displayValue}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
      />
    </div>
  );
}
