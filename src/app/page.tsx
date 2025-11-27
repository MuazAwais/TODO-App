// Home Page - Redirects to guest landing page
// This is what visitors see when they first visit the app

import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to guest landing page
  // Later you can add logic to check if user is logged in and redirect to dashboard
  redirect("/guest");
}
