// TaskList Component - Displays a list of tasks in a clean, minimalist way
// This component fetches and displays tasks using RTK Query

"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import EditTaskPopup from "./EditTaskPopup";
import DeleteTaskDialog from "./DeleteTaskDialog";

// TypeScript type for a task
// This matches what comes from our API
interface Task {
  id: number;
  title: string;
  description: string | null;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: number | null; // Unix timestamp in milliseconds
  category: string | null;
  createdAt: number; // Unix timestamp in milliseconds
  updatedAt: number; // Unix timestamp in milliseconds
}

interface TaskListProps {
  tasks?: Task[];
  isLoading?: boolean;
}

export default function TaskList({ tasks = [], isLoading = false }: TaskListProps) {
  // If loading, show a simple loading state
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 bg-muted animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  // If no tasks, show empty state
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-2">
          <svg
            className="mx-auto h-12 w-12 text-muted-foreground/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <p className="text-muted-foreground text-sm">No tasks yet</p>
        <p className="text-muted-foreground/70 text-xs mt-1">
          Create your first task to get started
        </p>
      </div>
    );
  }

  // Helper function to get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-600 dark:text-red-400";
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
      case "low":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "in_progress":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={cn(
            "group relative rounded-lg border bg-card p-4 transition-all",
            "hover:shadow-sm hover:border-primary/20"
          )}
        >
          {/* Task Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Title */}
              <h3
                className={cn(
                  "font-medium text-foreground mb-1",
                  task.status === "completed" && "line-through text-muted-foreground"
                )}
              >
                {task.title}
              </h3>

              {/* Description */}
              {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {task.description}
                </p>
              )}

              {/* Meta Info Row */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {/* Status Badge */}
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    getStatusColor(task.status)
                  )}
                >
                  {task.status === "in_progress"
                    ? "In Progress"
                    : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>

                {/* Priority Badge */}
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    getPriorityColor(task.priority)
                  )}
                >
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>

                {/* Category */}
                {task.category && (
                  <span className="text-xs text-muted-foreground">
                    {task.category}
                  </span>
                )}

                {/* Due Date */}
                {task.dueDate && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(typeof task.dueDate === 'number' ? task.dueDate : parseInt(task.dueDate)).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            {/* Actions (shown on hover) */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <EditTaskPopup task={task} />
              <DeleteTaskDialog taskId={task.id} taskTitle={task.title} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

