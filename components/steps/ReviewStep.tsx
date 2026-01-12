"use client";

import { UseFormReturn } from "react-hook-form";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormData } from "@/lib/schema";
import Image from "next/image";
import { useState, useEffect } from "react";

interface ReviewStepProps {
  form: UseFormReturn<FormData>;
  onEditStep: (step: number) => void;
}

interface FilePreview {
  logo: string | null;
  icon: string | null;
  backgroundImage: string | null;
}

export function ReviewStep({ form, onEditStep }: ReviewStepProps) {
  const values = form.getValues();
  const [previews, setPreviews] = useState<FilePreview>({
    logo: null,
    icon: null,
    backgroundImage: null,
  });

  useEffect(() => {
    const newPreviews: FilePreview = {
      logo: null,
      icon: null,
      backgroundImage: null,
    };

    if (values.logo instanceof File) {
      newPreviews.logo = URL.createObjectURL(values.logo);
    }
    if (values.icon instanceof File) {
      newPreviews.icon = URL.createObjectURL(values.icon);
    }
    if (values.backgroundImage instanceof File) {
      newPreviews.backgroundImage = URL.createObjectURL(values.backgroundImage);
    }

    setPreviews(newPreviews);

    return () => {
      if (newPreviews.logo) URL.revokeObjectURL(newPreviews.logo);
      if (newPreviews.icon) URL.revokeObjectURL(newPreviews.icon);
      if (newPreviews.backgroundImage) URL.revokeObjectURL(newPreviews.backgroundImage);
    };
  }, [values.logo, values.icon, values.backgroundImage]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">Review & Submit</h2>
        <p className="text-muted-foreground">
          Please review your information before submitting.
        </p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Business Information</CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(1)}
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Dispensary Name
                </dt>
                <dd className="text-sm">{values.dispensaryName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Contact Name
                </dt>
                <dd className="text-sm">{values.contactName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Contact Email
                </dt>
                <dd className="text-sm">{values.contactEmail}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Website</dt>
                <dd className="text-sm break-all">{values.website}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Store Count
                </dt>
                <dd className="text-sm">{values.storeCount}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Transferring Points
                </dt>
                <dd className="text-sm capitalize">{values.transferringPoints}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Brand Assets</CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(2)}
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              {previews.logo && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Logo</p>
                  <div className="relative h-20 w-full bg-muted rounded-md overflow-hidden">
                    <Image
                      src={previews.logo}
                      alt="Logo preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(values.logo as File)?.name}
                  </p>
                </div>
              )}
              {previews.icon && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Icon</p>
                  <div className="relative h-20 w-20 bg-muted rounded-md overflow-hidden">
                    <Image
                      src={previews.icon}
                      alt="Icon preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(values.icon as File)?.name}
                  </p>
                </div>
              )}
              {previews.backgroundImage && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Background
                  </p>
                  <div className="relative h-20 w-full bg-muted rounded-md overflow-hidden">
                    <Image
                      src={previews.backgroundImage}
                      alt="Background preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(values.backgroundImage as File)?.name}
                  </p>
                </div>
              )}
            </div>

            {values.brandHexCodes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Brand Colors
                </p>
                <p className="text-sm">{values.brandHexCodes}</p>
              </div>
            )}

            {values.designNotes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Design Notes
                </p>
                <p className="text-sm whitespace-pre-wrap">{values.designNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
