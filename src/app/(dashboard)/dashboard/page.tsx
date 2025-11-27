// Dashboard Page - Main page where users see and manage their tasks
// This connects all components together: filters, task list, and quick add form

"use client";

import { useState, useEffect } from "react";
import { initTheme } from "@/lib/utils/theme";
import { useGetTasksQuery, useCreateTaskMutation } from "@/lib/store/api/tasksApi";
import { Button } from "@/components/ui/button";
import NavbarWrapper from "@/components/layout/NavbarWrapper";
import TaskList from "@/components/tasks/TaskList";
import QuickAddForm from "@/components/tasks/QuickAddForm";
import TaskFilters from "@/components/tasks/TaskFilters";
import TaskAdderPopup from "@/components/tasks/TaskAdderPopup";

// Main Dashboard Component
export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  // Mobile filter sidebar state
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Filter state - controls what tasks are shown
  const [filters, setFilters] = useState({
    search: "",
    status: "all" as "all" | "pending" | "in_progress" | "completed",
    priority: "all" as "all" | "low" | "medium" | "high",
    category: "all",
  });

  // Initialize theme when page loads
  useEffect(() => {
    initTheme();
  }, []);

  // Check authentication before loading tasks
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });
        
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          // Use window.location for a clean redirect (avoids React rendering issues)
          window.location.href = "/login";
        }
      } catch (error) {
        setIsAuthenticated(false);
        // Use window.location for a clean redirect (avoids React rendering issues)
        window.location.href = "/login";
      }
    };

    checkAuth();
  }, []);

  // Fetch tasks using RTK Query - only if authenticated
  // This automatically handles loading, caching, and refetching
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetTasksQuery(
    {
      status: filters.status === "all" ? undefined : filters.status,
      priority: filters.priority === "all" ? undefined : filters.priority,
      search: filters.search || undefined,
      category: filters.category === "all" ? undefined : filters.category,
    },
    {
      // Skip the query if not authenticated
      skip: isAuthenticated !== true,
    }
  );

  // Mutation hook for creating tasks - MUST be called before any conditional returns
  const [createTask] = useCreateTaskMutation();

  // Handle 401 errors - redirect to login
  useEffect(() => {
    if (error && "status" in error && error.status === 401) {
      setIsAuthenticated(false);
      // Use window.location for a clean redirect (avoids React rendering issues)
      window.location.href = "/login";
    }
  }, [error]);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (isAuthenticated === false) {
    return null;
  }

  // Handle filter changes from TaskFilters component
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  // Handle task creation from QuickAddForm
  const handleCreateTask = async (title: string) => {
    try {
      await createTask({
        title,
        status: "pending",
        priority: "medium",
      }).unwrap();
      // Task list will automatically refresh thanks to RTK Query cache invalidation
    } catch (error) {
      console.error("Failed to create task:", error);
      alert("Failed to create task. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <NavbarWrapper />

      {/* Main Content */}
      <main>
        {/* Container with responsive padding */}
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header Section */}
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle Button */}
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl mb-2">
                  My Tasks
                </h1>
                <p className="text-sm text-muted-foreground sm:text-base">
                  {data?.total !== undefined ? `${data.total} task${data.total !== 1 ? "s" : ""}` : "Manage your tasks"}
                </p>
              </div>
            </div>
            {/* Task Adder Popup Button - Hidden on mobile (use floating button instead) */}
            <div className="hidden flex-shrink-0 lg:block">
              <TaskAdderPopup />
            </div>
          </div>
        </header>

        {/* Loading State - Show when initial load */}
        {isLoading && !data && (
          <div className="mb-4 p-4 rounded-lg border bg-card text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading tasks...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-4 p-4 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive text-sm">
            {("status" in error && error.status === 401) ? (
              <div>
                <p className="mb-2">Please log in to view your tasks.</p>
                <Button
                  onClick={() => {
                    window.location.href = "/login";
                  }}
                  variant="outline"
                  size="sm"
                >
                  Go to Login
                </Button>
              </div>
            ) : (
              <div>
                <p className="mb-2">Failed to load tasks. Please try again.</p>
                <Button
                  onClick={() => refetch()}
                  variant="outline"
                  size="sm"
                >
                  Retry
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Main Content Area - Responsive Layout */}
        <div className="flex gap-4 sm:gap-6">
          {/* Left Sidebar - Filters (hidden on mobile, visible on desktop) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-6">
              <div className="rounded-lg border bg-card p-4">
                <h2 className="text-lg font-semibold mb-4 text-foreground">
                  Filters
                </h2>
                <TaskFilters onFilterChange={handleFilterChange} />
              </div>
            </div>
          </aside>

          {/* Mobile Filter Sidebar - Overlay */}
          {showMobileFilters && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setShowMobileFilters(false)}
              />
              {/* Sidebar */}
              <aside className="fixed left-0 top-0 h-full w-80 bg-background border-r z-50 overflow-y-auto lg:hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">
                      Filters
                    </h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowMobileFilters(false)}
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </Button>
                  </div>
                  <TaskFilters onFilterChange={handleFilterChange} />
                </div>
              </aside>
            </>
          )}

          {/* Main Content - Task List */}
          <div className="flex-1 min-w-0">
            <TaskList tasks={data?.tasks} isLoading={isLoading} />
          </div>

          {/* Right Column - Quick Add Form (hidden on mobile, visible on desktop) */}
          <aside className="hidden xl:block w-80 flex-shrink-0">
            <div className="sticky top-6">
              <QuickAddForm onSubmit={handleCreateTask} />
            </div>
          </aside>
        </div>

        {/* Mobile Quick Add Button - Floating Action Button */}
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          <TaskAdderPopup
            trigger={
              <Button
                size="icon"
                className="h-14 w-14 rounded-full shadow-lg"
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
            }
          />
        </div>
        </div>
      </main>
    </div>
  );
}
