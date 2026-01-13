"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { ProgressBar } from "@/components/ProgressBar";
import { BusinessInfoStep } from "@/components/steps/BusinessInfoStep";
import { BrandAssetsStep } from "@/components/steps/BrandAssetsStep";
import { ReviewStep } from "@/components/steps/ReviewStep";
import {
  formSchema,
  businessInfoSchema,
  brandAssetsSchema,
  FormData,
} from "@/lib/schema";
import { saveFormDraft, loadFormDraft, clearFormDraft } from "@/lib/storage";
import { useRouter } from "next/navigation";

const STEP_LABELS = ["Business Info", "Brand Assets", "Review & Submit"];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export function LoyaltyForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isSubmittedRef = useRef(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dispensaryName: "",
      contactName: "",
      contactEmail: "",
      website: "",
      storeCount: 1,
      transferringPoints: undefined,
      logo: undefined,
      icon: undefined,
      backgroundImage: undefined,
      brandHexCodes: "",
      designNotes: "",
    },
    mode: "onChange",
  });

  // Load draft from localStorage
  useEffect(() => {
    const draft = loadFormDraft();
    if (draft) {
      if (draft.dispensaryName) form.setValue("dispensaryName", draft.dispensaryName);
      if (draft.contactName) form.setValue("contactName", draft.contactName);
      if (draft.contactEmail) form.setValue("contactEmail", draft.contactEmail);
      if (draft.website) form.setValue("website", draft.website);
      if (draft.storeCount) form.setValue("storeCount", draft.storeCount);
      if (draft.transferringPoints) {
        form.setValue("transferringPoints", draft.transferringPoints as "yes" | "no");
      }
      if (draft.brandHexCodes) form.setValue("brandHexCodes", draft.brandHexCodes);
      if (draft.designNotes) form.setValue("designNotes", draft.designNotes);
      if (draft.currentStep) setCurrentStep(draft.currentStep);
    }
    setIsLoading(false);
  }, [form]);

  // Auto-save to localStorage
  const watchedValues = form.watch();
  useEffect(() => {
    if (isLoading || isSubmittedRef.current) return;

    const timeoutId = setTimeout(() => {
      // Double-check ref in case submission happened while timeout was pending
      if (isSubmittedRef.current) return;

      saveFormDraft({
        dispensaryName: watchedValues.dispensaryName,
        contactName: watchedValues.contactName,
        contactEmail: watchedValues.contactEmail,
        website: watchedValues.website,
        storeCount: watchedValues.storeCount,
        transferringPoints: watchedValues.transferringPoints || "",
        brandHexCodes: watchedValues.brandHexCodes || "",
        designNotes: watchedValues.designNotes || "",
        currentStep,
      });
      setHasUnsavedChanges(true);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [watchedValues, currentStep, isLoading]);

  // Warn on page close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Prevent accidental submission when transitioning to step 3
  useEffect(() => {
    if (currentStep === 3) {
      setCanSubmit(false);
      const timer = setTimeout(() => setCanSubmit(true), 500);
      return () => clearTimeout(timer);
    } else {
      setCanSubmit(false);
    }
  }, [currentStep]);

  const validateCurrentStep = useCallback(async () => {
    const values = form.getValues();

    if (currentStep === 1) {
      const result = businessInfoSchema.safeParse(values);
      if (!result.success) {
        result.error.issues.forEach((err) => {
          form.setError(err.path[0] as keyof FormData, { message: err.message });
        });
        return false;
      }
    }

    if (currentStep === 2) {
      const result = brandAssetsSchema.safeParse(values);
      if (!result.success) {
        result.error.issues.forEach((err) => {
          form.setError(err.path[0] as keyof FormData, { message: err.message });
        });
        return false;
      }
    }

    return true;
  }, [currentStep, form]);

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < 3) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
  };

  const onSubmit = async (data: FormData) => {
    // Only allow submission from step 3 (review step) after delay
    if (currentStep !== 3 || !canSubmit) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new window.FormData();
      formData.append("dispensaryName", data.dispensaryName);
      formData.append("contactName", data.contactName);
      formData.append("contactEmail", data.contactEmail);
      formData.append("website", data.website);
      formData.append("storeCount", data.storeCount.toString());
      formData.append("transferringPoints", data.transferringPoints);
      formData.append("brandHexCodes", data.brandHexCodes || "");
      formData.append("designNotes", data.designNotes || "");

      if (data.logo) formData.append("logo", data.logo);
      if (data.icon) formData.append("icon", data.icon);
      if (data.backgroundImage) formData.append("backgroundImage", data.backgroundImage);

      const response = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      isSubmittedRef.current = true;
      setIsSubmitted(true);
      clearFormDraft();
      setHasUnsavedChanges(false);
      router.push("/thank-you");
    } catch (error) {
      console.error("Submission error:", error);
      alert("There was an error submitting your form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ProgressBar
          currentStep={currentStep}
          totalSteps={3}
          labels={STEP_LABELS}
        />

        <div className="min-h-[400px] relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              {currentStep === 1 && <BusinessInfoStep form={form} />}
              {currentStep === 2 && <BrandAssetsStep form={form} />}
              {currentStep === 3 && (
                <ReviewStep form={form} onEditStep={goToStep} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-between pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {currentStep < 3 ? (
            <Button type="button" onClick={nextStep} className="gap-2">
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting || !canSubmit}
              className="gap-2 min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
