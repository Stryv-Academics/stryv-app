"use client";

import * as React from "react";
import { Mail, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Support() {
  const router = useRouter();

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Heading */}
        <h1 className="text-2xl font-semibold tracking-tight text-center text-gray-900">
          Support Center
        </h1>

        {/* Subtext */}
        <p className="mt-2 text-sm text-center text-gray-600">
          Find answers to common questions or get in touch with our support
          team.
        </p>

        {/* Support Options */}
        <div className="mt-10 space-y-6">
          {/* FAQ Section */}
          <div className="flex items-center space-x-4 p-6 rounded-lg bg-blue-50 shadow-sm">
            <HelpCircle className="w-6 h-6 text-blue-600" />
            <div className="flex-1">
              <h2 className="text-lg font-medium text-gray-800">FAQs</h2>
              <p className="text-sm text-gray-600">
                Browse frequently asked questions.
              </p>
            </div>
            <Button
              onClick={() => router.push("/support/faqs")}
              className="h-12 px-6 font-medium text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              View FAQs
            </Button>
          </div>

          {/* Email Support */}
          <div className="flex items-center space-x-4 p-6 rounded-lg bg-blue-50 shadow-sm">
            <Mail className="w-6 h-6 text-blue-600" />
            <div className="flex-1">
              <h2 className="text-lg font-medium text-gray-800">
                Email Support
              </h2>
              <p className="text-sm text-gray-600">
                Need more help? Contact us directly.
              </p>
            </div>
            <Button
              onClick={() =>
                (window.location.href = "mailto:support@stryvacademics.com")
              }
              className="h-12 px-6 font-medium text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Email Us
            </Button>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-10 space-y-6">
          <Button
            onClick={() => router.push("/")}
            className="w-full h-12 font-medium text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go Home
          </Button>

          <Button
            variant="outline"
            onClick={() => router.back()}
            className="w-full h-12 font-medium text-gray-700 bg-white rounded-lg border border-gray-200 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
