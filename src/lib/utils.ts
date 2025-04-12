
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date utility function
export const formatDate = (date: Date | { toDate: () => Date } | undefined): string => {
  if (!date) return "N/A";
  
  const d = date instanceof Date ? date : date.toDate();
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
