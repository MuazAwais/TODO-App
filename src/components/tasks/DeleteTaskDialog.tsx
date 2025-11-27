// DeleteTaskDialog Component - Confirmation dialog for deleting a task
// Uses AlertDialog from shadcn/ui for confirmation

"use client";

import { useState } from "react";
import { useDeleteTaskMutation } from "@/lib/store/api/tasksApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteTaskDialogProps {
  taskId: number;
  taskTitle: string;
  // Optional callback when task is deleted successfully
  onTaskDeleted?: () => void;
  // Custom trigger button (if not provided, uses default)
  trigger?: React.ReactNode;
}

export default function DeleteTaskDialog({
  taskId,
  taskTitle,
  onTaskDeleted,
  trigger,
}: DeleteTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  // Handle delete confirmation
  const handleDelete = async () => {
    try {
      await deleteTask(taskId).unwrap();
      setOpen(false);
      
      // Call optional callback
      if (onTaskDeleted) {
        onTaskDeleted();
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert("Failed to delete task. Please try again.");
    }
  };

  // Default trigger button
  const defaultTrigger = (
    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </Button>
  );

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger || defaultTrigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the task <strong>&quot;{taskTitle}&quot;</strong>.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete Task"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

