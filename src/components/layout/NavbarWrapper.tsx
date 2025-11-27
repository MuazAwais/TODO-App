// Navbar Wrapper - Fetches user data and passes it to Navbar
// This is a client component that handles the user state

"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";

interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
}

export default function NavbarWrapper() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch current user
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Show navbar even while loading (it handles null user state)
  return <Navbar user={user} />;
}

