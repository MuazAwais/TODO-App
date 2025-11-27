// QuickAddForm Component - Simple form to quickly add new tasks
// Minimalist design with just title input and submit button

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface QuickAddFormProps {
  isMobile?: boolean;
  onSubmit?: (title: string) => void;
}

export default function QuickAddForm({ isMobile = false, onSubmit }: QuickAddFormProps) {
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return; // Don't submit empty tasks
    
    setIsSubmitting(true);
    
    // Call the onSubmit callback if provided
    if (onSubmit) {
      await onSubmit(title.trim());
    }
    
    // Reset form
    setTitle("");
    setIsSubmitting(false);
  };

  // Mobile version - Floating Action Button
  if (isMobile) {
    return (
      <Button
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg"
        onClick={() => {
          // For mobile, we'll show a simple prompt
          const taskTitle = prompt("What needs to be done?");
          if (taskTitle && onSubmit) {
            onSubmit(taskTitle);
          }
        }}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </Button>
    );
  }

  // Desktop version - Full form
  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="text-sm font-semibold mb-3 text-foreground">Quick Add</h3>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className={cn(
            "w-full px-3 py-2 rounded-md border border-input",
            "bg-background text-foreground",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "text-sm transition-all"
          )}
          disabled={isSubmitting}
        />
        
        <Button
          type="submit"
          className="w-full"
          disabled={!title.trim() || isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Task"}
        </Button>
      </form>
    </div>
  );
}

