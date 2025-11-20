import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge `clsx` and `tailwind-merge` to produce a single `cn` helper that
// supports conditional classnames and intelligently merges Tailwind classes.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}