import { z } from "zod";

export const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

export const businessInfoSchema = z.object({
  dispensaryName: z.string().min(1, "Dispensary name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  contactEmail: z.string().email("Please enter a valid email address"),
  website: z.string().url("Please enter a valid URL (include https://)"),
  storeCount: z.number().min(1, "Must have at least 1 store"),
  transferringPoints: z.enum(["yes", "no"], {
    message: "Please select an option",
  }),
});

export const brandAssetsSchema = z.object({
  logo: z.custom<File>((val) => val instanceof File, "Logo is required"),
  icon: z.custom<File>((val) => val instanceof File, "Icon is required"),
  backgroundImage: z.custom<File>().optional().nullable(),
  brandHexCodes: z.string().optional(),
  designNotes: z.string().optional(),
});

export const formSchema = z.object({
  ...businessInfoSchema.shape,
  ...brandAssetsSchema.shape,
});

export type BusinessInfoData = z.infer<typeof businessInfoSchema>;
export type BrandAssetsData = z.infer<typeof brandAssetsSchema>;
export type FormData = z.infer<typeof formSchema>;

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageDimensionRequirement {
  minWidth?: number;
  minHeight?: number;
  width?: number;
  height?: number;
  label: string;
}

export const imageDimensionRequirements: Record<"logo" | "icon" | "backgroundImage", ImageDimensionRequirement> = {
  logo: { minWidth: 480, minHeight: 150, label: "480×150px minimum" },
  icon: { width: 512, height: 512, label: "512×512px square" },
  backgroundImage: { width: 1125, height: 432, label: "1125×432px" },
};
