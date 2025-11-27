// Yup validation schemas for tasks
// Used to validate task creation and updates

import * as Yup from "yup";

// Task creation/update schema
export const taskSchema = Yup.object({
  title: Yup.string()
    .max(200, "Title must be less than 200 characters")
    .required("Title is required"),
  description: Yup.string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  status: Yup.string()
    .oneOf(["pending", "in_progress", "completed"], "Invalid status")
    .optional(),
  priority: Yup.string()
    .oneOf(["low", "medium", "high"], "Invalid priority")
    .optional(),
  dueDate: Yup.date().optional().nullable(),
  category: Yup.string()
    .max(50, "Category must be less than 50 characters")
    .optional(),
});

// TypeScript types inferred from schemas
export type TaskFormValues = Yup.InferType<typeof taskSchema>;

