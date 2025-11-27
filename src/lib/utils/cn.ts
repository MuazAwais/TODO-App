// Utility function for combining class names
// Useful when you need conditional classes or merge Tailwind classes

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Combines clsx (for conditional classes) with tailwind-merge (for Tailwind conflicts)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Example usage:
// cn("px-4 py-2", isActive && "bg-primary-500", "text-white")
// This will merge all classes and resolve any Tailwind conflicts

