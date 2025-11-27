// TaskFilters Component - Search and filter tasks
// This component allows users to search tasks and filter by status, priority, and category
// Uses React hooks (useState) to manage filter state locally

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

// TypeScript types for our filters
// This tells TypeScript what values our filters can have
type FilterStatus = "all" | "pending" | "in_progress" | "completed";
type FilterPriority = "all" | "low" | "medium" | "high";

// Props interface - defines what data this component can receive from parent
interface TaskFiltersProps {
  // Optional callback function - parent can listen to filter changes
  onFilterChange?: (filters: {
    search: string;
    status: FilterStatus;
    priority: FilterPriority;
    category: string;
  }) => void;
}

export default function TaskFilters({ onFilterChange }: TaskFiltersProps) {
  // useState Hook - manages component state (data that can change)
  // Think of it as a "memory" for the component
  // Format: [currentValue, functionToUpdateValue] = useState(initialValue)
  
  // Search query - what user types in the search box
  const [search, setSearch] = useState<string>("");
  
  // Status filter - which task status to show
  const [status, setStatus] = useState<FilterStatus>("all");
  
  // Priority filter - which priority level to show
  const [priority, setPriority] = useState<FilterPriority>("all");
  
  // Category filter - which category to show
  const [category, setCategory] = useState<string>("all");
  
  // Show/hide advanced filters on mobile
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Handle search input change
  // This function runs every time user types in the search box
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // Get what user typed
    setSearch(value); // Update our state
    // Notify parent component about the change
    onFilterChange?.({
      search: value,
      status,
      priority,
      category,
    });
  };

  // Handle status filter change
  const handleStatusChange = (newStatus: FilterStatus) => {
    setStatus(newStatus);
    onFilterChange?.({
      search,
      status: newStatus,
      priority,
      category,
    });
  };

  // Handle priority filter change
  const handlePriorityChange = (newPriority: FilterPriority) => {
    setPriority(newPriority);
    onFilterChange?.({
      search,
      status,
      priority: newPriority,
      category,
    });
  };

  // Handle category filter change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCategory(value);
    onFilterChange?.({
      search,
      status,
      priority,
      category: value,
    });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearch("");
    setStatus("all");
    setPriority("all");
    setCategory("all");
    onFilterChange?.({
      search: "",
      status: "all",
      priority: "all",
      category: "all",
    });
  };

  return (
    <div className="space-y-4">
      {/* Search Bar - always visible */}
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={handleSearchChange}
          className={cn(
            "w-full pl-10 pr-4 py-2 rounded-lg border border-input",
            "bg-background text-foreground",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "transition-all duration-200 text-sm"
          )}
        />
      </div>

      {/* Status Section */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Status</label>
        <div className="flex flex-wrap gap-2">
          {/* Status Filter Buttons */}
          {(["all", "pending", "in_progress", "completed"] as FilterStatus[]).map(
            (filterStatus) => (
              <button
                key={filterStatus}
                onClick={() => handleStatusChange(filterStatus)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  "border border-input",
                  status === filterStatus
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background text-foreground hover:bg-accent"
                )}
              >
                {/* Format status text nicely */}
                {filterStatus === "all"
                  ? "All"
                  : filterStatus === "in_progress"
                  ? "In Progress"
                  : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      {/* Advanced Filters - collapsible on mobile, always visible on desktop */}
      <div
        className={cn(
          "space-y-4 border-t border-border pt-4",
          showAdvanced ? "block" : "hidden lg:block"
        )}
      >
        {/* Priority Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Priority</label>
          <div className="flex flex-wrap gap-2">
            {(["all", "low", "medium", "high"] as FilterPriority[]).map(
              (filterPriority) => (
                <button
                  key={filterPriority}
                  onClick={() => handlePriorityChange(filterPriority)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    "border border-input",
                    priority === filterPriority
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-background text-foreground hover:bg-accent"
                  )}
                >
                  {filterPriority === "all"
                    ? "All"
                    : filterPriority.charAt(0).toUpperCase() +
                      filterPriority.slice(1)}
                </button>
              )
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Category</label>
          <select
            value={category}
            onChange={handleCategoryChange}
            className={cn(
              "w-full px-3 py-2 rounded-md border border-input text-sm",
              "bg-background text-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "transition-all duration-200"
            )}
          >
            <option value="all">All Categories</option>
            {/* Categories will be populated from your tasks */}
            {/* For now, we'll add some example categories */}
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="shopping">Shopping</option>
            <option value="health">Health</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {(search || status !== "all" || priority !== "all" || category !== "all") && (
          <button
            onClick={handleClearFilters}
            className={cn(
              "w-full px-4 py-2 rounded-md text-sm font-medium",
              "bg-secondary text-secondary-foreground",
              "hover:bg-secondary/80 transition-colors",
              "border border-input"
            )}
          >
            Clear All Filters
          </button>
        )}
        
        {/* Toggle Advanced Filters Button (Mobile) */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={cn(
            "lg:hidden w-full px-4 py-2 rounded-md text-sm font-medium",
            "border border-input bg-background text-foreground",
            "hover:bg-accent transition-colors"
          )}
        >
          {showAdvanced ? "Show Less" : "Show More"}
        </button>
      </div>
    </div>
  );
}

