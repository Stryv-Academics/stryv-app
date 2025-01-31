"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function FAQ() {
  const router = useRouter();

  return (
    <div className="min-h-[100dvh] bg-linear-to-b from-white to-gray-50 flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Heading */}
        <h1 className="text-2xl font-semibold tracking-tight text-center text-gray-900">
          Frequently Asked Questions
        </h1>

        {/* Subtext */}
        <p className="mt-2 text-sm text-center text-gray-600">
          Find answers to the most commonly asked questions below.
        </p>

        {/* FAQ List */}
        <div className="mt-10 space-y-6">
          {/* Question 1 */}
          <div className="p-6 rounded-lg bg-blue-50 shadow-xs">
            <h2 className="text-lg font-medium text-gray-800">
              How do I contact support?
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              You can contact support via email at support@stryvacademics.com or
              through WhatsApp at +1 (720) 646-6365.
            </p>
          </div>

          {/* Question 2 */}
          <div className="p-6 rounded-lg bg-blue-50 shadow-xs">
            <h2 className="text-lg font-medium text-gray-800">
              What are your support hours?
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Our support team is available Monday through Friday, 9 AM to 6 PM
              (MST).
            </p>
          </div>

          {/* Question 3 */}
          <div className="p-6 rounded-lg bg-blue-50 shadow-xs">
            <h2 className="text-lg font-medium text-gray-800">
              How do I reset my password?
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Click "Forgot Password" on the login page and follow the
              instructions to reset your password.
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-10 space-y-6">
          <Button
            onClick={() => router.push("/")}
            className="w-full h-12 font-medium text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go Home
          </Button>

          <Button
            variant="outline"
            onClick={() => router.back()}
            className="w-full h-12 font-medium text-gray-700 bg-white rounded-lg border border-gray-200 shadow-xs transition-all hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
