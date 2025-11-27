// Guest Landing Page - Beautiful landing page for visitors
// This is what users see when they first visit the app

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import NavbarWrapper from "@/components/layout/NavbarWrapper";
import { initTheme } from "@/lib/utils/theme";

export default function GuestPage() {
  const router = useRouter();

  // Initialize theme
  useEffect(() => {
    initTheme();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <NavbarWrapper />

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main Heading */}
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Organize Your Life,
            <br />
            <span className="text-primary">One Task at a Time</span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
            A beautiful, minimalist todo app that helps you stay focused and get things done.
            Built with modern technology and designed for simplicity.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              onClick={() => router.push("/register")}
              className="w-full sm:w-auto px-8 py-6 text-base"
            >
              Get Started Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/login")}
              className="w-full sm:w-auto px-8 py-6 text-base"
            >
              Sign In
            </Button>
          </div>

          {/* Features Grid */}
          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg border bg-card p-6 text-left">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Simple & Clean
              </h3>
              <p className="text-sm text-muted-foreground">
                Focus on what matters with a clutter-free interface designed for productivity.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border bg-card p-6 text-left">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Stay Organized
              </h3>
              <p className="text-sm text-muted-foreground">
                Organize tasks by priority, category, and due date. Never miss a deadline again.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border bg-card p-6 text-left">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Powerful Search
              </h3>
              <p className="text-sm text-muted-foreground">
                Find tasks instantly with smart search and filtering. Your data, always accessible.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-lg border bg-card p-6 text-left">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
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
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Mobile First
              </h3>
              <p className="text-sm text-muted-foreground">
                Works perfectly on all devices. Manage your tasks from anywhere, anytime.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-lg border bg-card p-6 text-left">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
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
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Dark Mode
              </h3>
              <p className="text-sm text-muted-foreground">
                Beautiful dark mode for comfortable viewing in any lighting condition.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-lg border bg-card p-6 text-left">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Secure & Private
              </h3>
              <p className="text-sm text-muted-foreground">
                Your data is encrypted and secure. We take your privacy seriously.
              </p>
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-20 rounded-2xl border bg-card p-8 sm:p-12">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Ready to get started?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join thousands of users who are already organizing their lives with our app.
            </p>
            <div className="mt-6">
              <Button
                size="lg"
                onClick={() => router.push("/register")}
                className="px-8 py-6 text-base"
              >
                Create Your Free Account
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TODO App. Built with Next.js and TypeScript.
          </p>
        </div>
      </footer>
    </div>
  );
}

