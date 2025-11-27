// Task API Route - Handles PUT (update task) and DELETE (delete task) for a specific task
// Next.js dynamic routes: app/api/tasks/[id]/route.ts handles /api/tasks/:id

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";
import { taskSchema } from "@/lib/validations/task.schema";
import { eq, and } from "drizzle-orm";

// PUT /api/tasks/:id - Update a task
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Step 1: Authenticate the user
  const authResult = await requireAuth(request);
  if (authResult.response) {
    return authResult.response;
  }
  const { user } = authResult;

  try {
    // Step 2: Get the task ID from URL params
    const taskId = parseInt(params.id);
    if (isNaN(taskId)) {
      return NextResponse.json(
        {
          error: {
            message: "Invalid task ID",
            code: "INVALID_ID",
          },
        },
        { status: 400 }
      );
    }

    // Step 3: Verify the task belongs to the user
    const [existingTask] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, user.id)))
      .limit(1);

    if (!existingTask) {
      return NextResponse.json(
        {
          error: {
            message: "Task not found",
            code: "NOT_FOUND",
          },
        },
        { status: 404 }
      );
    }

    // Step 4: Get and validate the request body
    const body = await request.json();

    let validatedData;
    try {
      validatedData = await taskSchema.validate(body, {
        abortEarly: false,
        stripUnknown: true,
      });
    } catch (validationError: any) {
      return NextResponse.json(
        {
          error: {
            message: "Validation failed",
            code: "VALIDATION_ERROR",
            details: validationError.errors,
          },
        },
        { status: 400 }
      );
    }

    // Step 5: Update the task
    // Only update fields that are provided
    const updateData: any = {
      updatedAt: Date.now(), // Always update the updatedAt timestamp
    };

    if (validatedData.title !== undefined) {
      updateData.title = validatedData.title;
    }
    if (validatedData.description !== undefined) {
      updateData.description = validatedData.description || null;
    }
    if (validatedData.status !== undefined) {
      updateData.status = validatedData.status;
      // If marking as completed, set completedAt
      if (validatedData.status === "completed" && !existingTask.completedAt) {
        updateData.completedAt = Date.now();
      } else if (validatedData.status !== "completed") {
        updateData.completedAt = null;
      }
    }
    if (validatedData.priority !== undefined) {
      updateData.priority = validatedData.priority;
    }
    if (validatedData.dueDate !== undefined) {
      updateData.dueDate = validatedData.dueDate
        ? new Date(validatedData.dueDate).getTime()
        : null;
    }
    if (validatedData.category !== undefined) {
      updateData.category = validatedData.category || null;
    }

    // Perform the update
    const [updatedTask] = await db
      .update(tasks)
      .set(updateData)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, user.id)))
      .returning();

    // Step 6: Return success response
    return NextResponse.json(
      {
        task: updatedTask,
        message: "Task updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      {
        error: {
          message: "Failed to update task",
          code: "UPDATE_ERROR",
        },
      },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/:id - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Step 1: Authenticate the user
  const authResult = await requireAuth(request);
  if (authResult.response) {
    return authResult.response;
  }
  const { user } = authResult;

  try {
    // Step 2: Get the task ID from URL params
    const taskId = parseInt(params.id);
    if (isNaN(taskId)) {
      return NextResponse.json(
        {
          error: {
            message: "Invalid task ID",
            code: "INVALID_ID",
          },
        },
        { status: 400 }
      );
    }

    // Step 3: Verify the task belongs to the user
    const [existingTask] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, user.id)))
      .limit(1);

    if (!existingTask) {
      return NextResponse.json(
        {
          error: {
            message: "Task not found",
            code: "NOT_FOUND",
          },
        },
        { status: 404 }
      );
    }

    // Step 4: Delete the task
    await db
      .delete(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, user.id)));

    // Step 5: Return success response
    return NextResponse.json(
      {
        message: "Task deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      {
        error: {
          message: "Failed to delete task",
          code: "DELETE_ERROR",
        },
      },
      { status: 500 }
    );
  }
}

