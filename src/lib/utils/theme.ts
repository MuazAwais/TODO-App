// Theme utility functions for light/dark mode
// These functions help manage theme switching

"use client"; // Client component (needs browser APIs)

// Get current theme from localStorage or system preference
export function getTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  
  // Check localStorage first
  const stored = localStorage.getItem("theme") as "light" | "dark" | null;
  if (stored) return stored;
  
  // Check system preference
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  
  return "light";
}

// Set theme and update DOM
export function setTheme(theme: "light" | "dark") {
  if (typeof window === "undefined") return;
  
  // Save to localStorage
  localStorage.setItem("theme", theme);
  
  // Update HTML class
  const root = window.document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
}

// Initialize theme on page load
export function initTheme() {
  if (typeof window === "undefined") return;
  
  const theme = getTheme();
  setTheme(theme);
}

