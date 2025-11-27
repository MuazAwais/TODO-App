// Profile Page - User profile management
// Allows users to view and update their profile information

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { initTheme } from "@/lib/utils/theme";
import NavbarWrapper from "@/components/layout/NavbarWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";

// Validation schema
const profileSchema = Yup.object({
  firstName: Yup.string()
    .max(50, "First name must be less than 50 characters")
    .optional()
    .nullable(),
  lastName: Yup.string()
    .max(50, "Last name must be less than 50 characters")
    .optional()
    .nullable(),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  email: string;
};

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  emailVerified: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize theme
  useEffect(() => {
    initTheme();
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else if (response.status === 401) {
          window.location.href = "/login";
        } else {
          setError("Failed to load profile");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Handle form submission
  const handleSubmit = async (values: ProfileFormValues) => {
    setIsUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          firstName: values.firstName || null,
          lastName: values.lastName || null,
          email: values.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setSuccess("Profile updated successfully!");
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavbarWrapper />
        <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-4xl">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground text-sm">Loading profile...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // No user data
  if (!user) {
    return null;
  }

  // Initial form values
  const initialValues: ProfileFormValues = {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
  };

  // Get display name
  const displayName = user.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
    : user.email?.split("@")[0] || "User";

  // Format account creation date
  const accountCreatedDate = user.id
    ? new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <div className="min-h-screen bg-background">
      <NavbarWrapper />

      <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </header>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 rounded-lg border border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400 text-sm">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border bg-card p-6">
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary text-2xl font-semibold mb-4">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  {displayName}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {user.email}
                </p>
              </div>

              {/* Account Info */}
              <div className="space-y-4 border-t border-border pt-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Account Status
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        user.isActive
                          ? "bg-green-500"
                          : "bg-red-500"
                      )}
                    />
                    <span className="text-sm text-foreground">
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Email Verified
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        user.emailVerified
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      )}
                    />
                    <span className="text-sm text-foreground">
                      {user.emailVerified ? "Verified" : "Not Verified"}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Member Since
                  </p>
                  <p className="text-sm text-foreground">
                    {accountCreatedDate}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Edit Form */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Edit Profile
              </h3>

              <Formik
                initialValues={initialValues}
                validationSchema={profileSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form className="space-y-4">
                    {/* First Name */}
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Field
                        as={Input}
                        id="firstName"
                        name="firstName"
                        placeholder="Enter your first name"
                        className={cn(
                          errors.firstName &&
                            touched.firstName &&
                            "border-destructive"
                        )}
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="text-sm text-destructive"
                      />
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Field
                        as={Input}
                        id="lastName"
                        name="lastName"
                        placeholder="Enter your last name"
                        className={cn(
                          errors.lastName &&
                            touched.lastName &&
                            "border-destructive"
                        )}
                      />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="text-sm text-destructive"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Field
                        as={Input}
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className={cn(
                          errors.email && touched.email && "border-destructive"
                        )}
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-sm text-destructive"
                      />
                      {!user.emailVerified && (
                        <p className="text-xs text-yellow-600 dark:text-yellow-400">
                          Your email is not verified. Changing your email will
                          require verification.
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isSubmitting || isUpdating}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting || isUpdating}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {isSubmitting || isUpdating
                          ? "Updating..."
                          : "Update Profile"}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

