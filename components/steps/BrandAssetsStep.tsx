"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/FileUpload";
import { ColorInput } from "@/components/ColorInput";
import { InfoTooltip } from "@/components/InfoTooltip";
import { FormData } from "@/lib/schema";

interface BrandAssetsStepProps {
  form: UseFormReturn<FormData>;
}

export function BrandAssetsStep({ form }: BrandAssetsStepProps) {
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

        <div className="space-y-2">
          <h3 className="text-lg font-medium flex items-center gap-2">
            Colors
            <InfoTooltip content="Your brand colors for the loyalty card design" />
            <span className="text-muted-foreground font-normal text-sm">(Optional)</span>
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="cardBackgroundColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card background</FormLabel>
                  <FormControl>
                    <ColorInput
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="#FFFFFF"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="textColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text color</FormLabel>
                  <FormControl>
                    <ColorInput
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="#000000"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="centerBackgroundColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background color of the center part</FormLabel>
                <FormControl>
                  <ColorInput
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="#F6F6F6"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
