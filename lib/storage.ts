const STORAGE_KEY = "treez-loyalty-form-draft";

export interface StoredFormData {
  dispensaryName: string;
  contactName: string;
  contactEmail: string;
  website: string;
  storeCount: number;
  transferringPoints: "yes" | "no" | "";
  cardBackgroundColor: string;
  textColor: string;
  centerBackgroundColor: string;
  designNotes: string;
  currentStep: number;
  lastUpdated: string;
}

export function saveFormDraft(data: Partial<StoredFormData>): void {
  if (typeof window === "undefined") return;

  const existing = loadFormDraft();
  const updated = {
    ...existing,
    ...data,
    lastUpdated: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save form draft:", error);
  }
}

export function loadFormDraft(): Partial<StoredFormData> | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to load form draft:", error);
    return null;
  }
}

export function clearFormDraft(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear form draft:", error);
  }
}

export function hasFormDraft(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) !== null;
}
