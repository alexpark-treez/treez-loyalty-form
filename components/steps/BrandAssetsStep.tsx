"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/FileUpload";
import { ColorSwatches } from "@/components/ColorSwatches";
import { InfoTooltip } from "@/components/InfoTooltip";
import { FormData } from "@/lib/schema";

interface BrandAssetsStepProps {
  form: UseFormReturn<FormData>;
}

export function BrandAssetsStep({ form }: BrandAssetsStepProps) {
  const brandHexCodes = form.watch("brandHexCodes");

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">Brand Assets</h2>
        <p className="text-muted-foreground">
          Upload your logos and brand colors for your loyalty program.
        </p>
      </div>

      <div className="space-y-6">
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Logo
                <InfoTooltip content="Your primary logo that will appear on your loyalty program materials" />
              </FormLabel>
              <FormControl>
                <FileUpload
                  onFileSelect={field.onChange}
                  value={field.value as File | null}
                  imageType="logo"
                  helperText="Recommended size: 480x150 pixels. The minimum height is 150px. Only PNG format. 3 megabytes."
                  required
                  error={form.formState.errors.logo?.message as string | undefined}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Icon
                <InfoTooltip content="A square icon version of your logo for app icons and small displays" />
              </FormLabel>
              <FormControl>
                <FileUpload
                  onFileSelect={field.onChange}
                  value={field.value as File | null}
                  imageType="icon"
                  helperText="Recommended icon size: 512x512 pixels. The image must be square. Only PNG format. 3 megabytes."
                  required
                  error={form.formState.errors.icon?.message as string | undefined}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="backgroundImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Background Image
                <InfoTooltip content="Optional background image for your loyalty cards and app screens" />
                <span className="text-muted-foreground font-normal ml-1">(Optional)</span>
              </FormLabel>
              <FormControl>
                <FileUpload
                  onFileSelect={field.onChange}
                  value={field.value as File | null}
                  imageType="backgroundImage"
                  helperText="The minimum file size is 1125x432 pixels. Only PNG format. 3 megabytes."
                  error={form.formState.errors.backgroundImage?.message as string | undefined}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brandHexCodes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Brand Hex Codes
                <InfoTooltip content="Your brand colors in hex format for design consistency" />
                <span className="text-muted-foreground font-normal ml-1">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="#6ABF4B, #000000" {...field} />
              </FormControl>
              <ColorSwatches hexString={brandHexCodes || ""} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="designNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Notes for Design Team
                <InfoTooltip content="Any specific design preferences or instructions for our team" />
                <span className="text-muted-foreground font-normal ml-1">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any specific design requirements or preferences..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
