"use client";

import { useMemo } from "react";

interface ColorSwatchesProps {
  hexString: string;
}

export function ColorSwatches({ hexString }: ColorSwatchesProps) {
  const colors = useMemo(() => {
    if (!hexString) return [];

    // Parse comma-separated hex codes
    const hexRegex = /#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g;
    const matches = hexString.match(hexRegex) || [];

    return matches.map((hex) => {
      // Normalize to include #
      return hex.startsWith("#") ? hex : `#${hex}`;
    });
  }, [hexString]);

  if (colors.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mt-2">
      <span className="text-xs text-muted-foreground">Preview:</span>
      <div className="flex gap-1">
        {colors.map((color, index) => (
          <div
            key={`${color}-${index}`}
            className="w-6 h-6 rounded-md border border-border shadow-sm"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
}
