// TaskAdderPopup Component - Full-featured task creation popup
// Uses Formik + Yup for form handling and validation
// Includes all task fields: title, description, dueDate, priority, status, category

"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useCreateTaskMutation } from "@/lib/store/api/tasksApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";

// Validation schema using Yup
const taskFormSchema = Yup.object({
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

// TypeScript type for form values
type TaskFormValues = {
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string;
  category: string;
};

interface TaskAdderPopupProps {
  // Optional callback when task is created successfully
  onTaskCreated?: () => void;
  // Custom trigger button (if not provided, uses default)
  trigger?: React.ReactNode;
}

export default function TaskAdderPopup({
  onTaskCreated,
  trigger,
}: TaskAdderPopupProps) {
  const [open, setOpen] = useState(false);
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();

  // Initial form values
  const initialValues: TaskFormValues = {
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
    category: "",
  };

  // Handle form submission
  const handleSubmit = async (
    values: TaskFormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      // Prepare data for API
      const taskData = {
        title: values.title.trim(),
        description: values.description.trim() || undefined,
        status: values.status,
        priority: values.priority,
        dueDate: values.dueDate || undefined,
        category: values.category.trim() || undefined,
      };

      // Create task via RTK Query mutation
      await createTask(taskData).unwrap();

      // Reset form and close dialog
      resetForm();
      setOpen(false);

      // Call optional callback
      if (onTaskCreated) {
        onTaskCreated();
      }
    } catch (error) {
      console.error("Failed to create task:", error);
      // Error is handled by Formik's setFieldError or you can show a toast
      alert("Failed to create task. Please try again.");
    }
  };

  // Default trigger button
  const defaultTrigger = (
    <Button className="w-full sm:w-auto">
      <svg
        className="mr-2 h-4 w-4"
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
      Add New Task
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new task. All fields except
            title are optional.
          </DialogDescription>
        </DialogHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={taskFormSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors, touched, isSubmitting }) => (
            <Form className="space-y-4">
              {/* Title Field - Required */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Field
                  as={Input}
                  id="title"
                  name="title"
                  placeholder="Enter task title..."
                  className={cn(
                    errors.title && touched.title && "border-destructive"
                  )}
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-sm text-destructive"
                />
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  placeholder="Add a description (optional)..."
                  rows={4}
                  className={cn(
                    "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    errors.description &&
                      touched.description &&
                      "border-destructive"
                  )}
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-sm text-destructive"
                />
              </div>

              {/* Status and Priority - Side by Side */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Status Field */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={values.status}
                    onValueChange={(value) =>
                      setFieldValue("status", value)
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority Field */}
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={values.priority}
                    onValueChange={(value) =>
                      setFieldValue("priority", value)
                    }
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Due Date and Category - Side by Side */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Due Date Field */}
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Field
                    as={Input}
                    id="dueDate"
                    name="dueDate"
                    type="datetime-local"
                    className={cn(
                      errors.dueDate && touched.dueDate && "border-destructive"
                    )}
                  />
                  <ErrorMessage
                    name="dueDate"
                    component="div"
                    className="text-sm text-destructive"
                  />
                </div>

                {/* Category Field */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Field
                    as={Input}
                    id="category"
                    name="category"
                    placeholder="e.g., Work, Personal..."
                    className={cn(
                      errors.category &&
                        touched.category &&
                        "border-destructive"
                    )}
                  />
                  <ErrorMessage
                    name="category"
                    component="div"
                    className="text-sm text-destructive"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting || isCreating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || isCreating}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting || isCreating ? "Creating..." : "Create Task"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

