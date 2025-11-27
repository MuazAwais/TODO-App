// Tasks API Route - Handles GET (list tasks) and POST (create task)
// This is a Next.js API route handler
// In Next.js App Router, API routes are defined in app/api/[route]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";
import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";
import { taskSchema } from "@/lib/validations/task.schema";
import { eq, and, or, like, desc, asc } from "drizzle-orm";

// GET /api/tasks - List all tasks for the authenticated user
// Supports filtering, searching, sorting, and pagination
export async function GET(request: NextRequest) {
  // Step 1: Authenticate the user
  // This ensures only logged-in users can access their tasks
  const authResult = await requireAuth(request);
  if (authResult.response) {
    return authResult.response; // Returns 401 if not authenticated
  }
  const { user } = authResult;

  try {
    // Step 2: Get query parameters from the URL
    // Example: /api/tasks?status=completed&priority=high&search=meeting
    const searchParams = request.nextUrl.searchParams;
    
    // Extract filter values
    const status = searchParams.get("status") || "all";
    const priority = searchParams.get("priority") || "all";
    const category = searchParams.get("category") || "all";
    const search = searchParams.get("search") || "";
    
    // Sorting options
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc"; // desc or asc
    
    // Pagination (optional - for handling large lists)
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    // Step 3: Build the database query conditions
    // Start with the base condition: only get tasks belonging to this user
    const conditions = [eq(tasks.userId, user.id)];

    // Add status filter (if not "all")
    if (status !== "all") {
      conditions.push(eq(tasks.status, status as "pending" | "in_progress" | "completed"));
    }

    // Add priority filter (if not "all")
    if (priority !== "all") {
      conditions.push(eq(tasks.priority, priority as "low" | "medium" | "high"));
    }

    // Add category filter (if not "all")
    if (category !== "all") {
      conditions.push(eq(tasks.category, category));
    }

    // Add search filter (searches in title and description)
    if (search) {
      conditions.push(
        or(
          like(tasks.title, `%${search}%`), // % means "contains"
          like(tasks.description, `%${search}%`)
        )!
      );
    }

    // Step 4: Build the sorting
    // Drizzle uses functions like desc() and asc() for sorting
    let orderBy;
    switch (sortBy) {
      case "title":
        orderBy = sortOrder === "asc" ? asc(tasks.title) : desc(tasks.title);
        break;
      case "dueDate":
        orderBy = sortOrder === "asc" ? asc(tasks.dueDate) : desc(tasks.dueDate);
        break;
      case "priority":
        // For priority, we'll sort by a custom order (high > medium > low)
        // This is a simplified version - you could make it more sophisticated
        orderBy = sortOrder === "asc" ? asc(tasks.priority) : desc(tasks.priority);
        break;
      case "status":
        orderBy = sortOrder === "asc" ? asc(tasks.status) : desc(tasks.status);
        break;
      default:
        orderBy = sortOrder === "asc" ? asc(tasks.createdAt) : desc(tasks.createdAt);
    }

    // Step 5: Execute the database query
    // and() combines all conditions with AND logic
    // This means: user's tasks AND matching status AND matching priority, etc.
    const userTasks = await db
      .select()
      .from(tasks)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // Step 6: Get total count (for pagination info)
    // This helps the frontend know how many pages there are
    const totalCountResult = await db
      .select({ count: tasks.id })
      .from(tasks)
      .where(and(...conditions));
    
    const total = totalCountResult.length;

    // Step 7: Return the response
    // Return structure that matches what RTK Query expects
    return NextResponse.json({
      tasks: userTasks,
      total: total, // Direct total for RTK Query
      pagination: {
        page,
        limit,
        total: total,
        totalPages: Math.ceil(total / limit),
      },
      filters: {
        status,
        priority,
        category,
        search,
      },
    });
  } catch (error) {
    // Handle any errors that occur
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      {
        error: {
          message: "Failed to fetch tasks",
          code: "FETCH_ERROR",
        },
      },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  // Step 1: Authenticate the user
  const authResult = await requireAuth(request);
  if (authResult.response) {
    return authResult.response;
  }
  const { user } = authResult;

  try {
    // Step 2: Get the request body (the task data)
    const body = await request.json();

    // Step 3: Validate the data using Yup schema
    // This ensures the data is in the correct format
    let validatedData;
    try {
      validatedData = await taskSchema.validate(body, {
        abortEarly: false, // Return all errors, not just the first one
        stripUnknown: true, // Remove any fields not in the schema
      });
    } catch (validationError: any) {
      // If validation fails, return error with details
      return NextResponse.json(
        {
          error: {
            message: "Validation failed",
            code: "VALIDATION_ERROR",
            details: validationError.errors, // List of validation errors
          },
        },
        { status: 400 }
      );
    }

    // Step 4: Create the task in the database
    // Drizzle's insert() function creates a new record
    const now = Date.now(); // Current timestamp in milliseconds (Unix timestamp)
    const [newTask] = await db
      .insert(tasks)
      .values({
        userId: user.id, // Always set to the authenticated user's ID
        title: validatedData.title,
        description: validatedData.description || null,
        status: (validatedData.status as "pending" | "in_progress" | "completed") || "pending",
        priority: (validatedData.priority as "low" | "medium" | "high") || "medium",
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate).getTime() : null,
        category: validatedData.category || null,
        createdAt: now, // Unix timestamp in milliseconds
        updatedAt: now,  // Unix timestamp in milliseconds
      })
      .returning(); // Return the newly created task

    // Step 5: Return success response with the new task
    return NextResponse.json(
      {
        task: newTask,
        message: "Task created successfully",
      },
      { status: 201 } // 201 = Created
    );
  } catch (error) {
    // Handle errors
    console.error("Error creating task:", error);
    return NextResponse.json(
      {
        error: {
          message: "Failed to create task",
          code: "CREATE_ERROR",
        },
      },
      { status: 500 }
    );
  }
}

