"use client";

import { Button } from "@/components/ui/button"; // ShadCN UI Button
import SVGLogo from "@/components/svg-logo"; // Replace this with your logo component
import { useRouter } from "next/navigation"; // For navigation

export default function NotFound() {
  const router = useRouter(); // For programmatic navigation

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <SVGLogo /> {/* Replace this with your SVG logo component */}
        </div>

        {/* Heading */}
        <h1 className="mt-10 text-2xl font-semibold tracking-tight text-center text-gray-900">
          Oops! Page Not Found
        </h1>

        {/* Subtext */}
        <p className="mt-2 text-sm text-center text-gray-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

          {/* Actions */}
          <div className="mt-10 space-y-6">
            {/* Go Home Button */}
            <Button
              onClick={() => router.push("/")} // Navigate to home page
              className="w-full h-12 font-medium text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Go Home
            </Button>

            {/* Go Back Button */}
            <Button
              variant="outline"
              onClick={() => router.back()} // Navigate to previous page
              className="w-full h-12 font-medium text-gray-700 bg-white rounded-lg border border-gray-200 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Go Back
            </Button>
          </div>

          {/* Additional Links */}
          <p className="mt-8 text-sm text-center text-gray-600">
            Need help? Visit our{" "}
            <a
              href="/contact"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Contact Page
            </a>
            .
          </p>
        </div>
      </div>
  );
}
