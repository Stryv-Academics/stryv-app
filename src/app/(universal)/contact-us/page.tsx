"use client";

import * as React from "react";
import { Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ContactUs() {
  const router = useRouter();

  return (
    <div className="min-h-[100dvh] bg-linear-to-b from-white to-gray-50 flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Heading */}
        <h1 className="text-2xl font-semibold tracking-tight text-center text-gray-900">
          Contact Us
        </h1>

        {/* Subtext */}
        <p className="mt-2 text-sm text-center text-gray-600">
          Reach out to us via email or WhatsApp. We are here to help!
        </p>

        {/* Contact Options */}
        <div className="mt-10 space-y-6">
          {/* Email Contact */}
          <div className="flex items-center space-x-4 p-6 rounded-lg bg-blue-50 shadow-xs">
            <Mail className="w-6 h-6 text-blue-600" />
            <div className="flex-1">
              <h2 className="text-lg font-medium text-gray-800">Email</h2>
              <p className="text-sm text-gray-600">zach@stryvacademics.com</p>
            </div>
            <Button
              onClick={() =>
                (window.location.href = "mailto:zach@stryvacademics.com")
              }
              className="h-12 px-6 font-medium text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Email Us
            </Button>
          </div>

          {/* WhatsApp Contact */}
          <div className="flex items-center space-x-4 p-6 rounded-lg bg-blue-50 shadow-xs">
            <Phone className="w-6 h-6 text-blue-600" />
            <div className="flex-1">
              <h2 className="text-lg font-medium text-gray-800">WhatsApp</h2>
              <p className="text-sm text-gray-600">+1 (720) 646-6365</p>
            </div>
            <Button
              onClick={() => window.open("https://wa.me/17206466365", "_blank")}
              className="h-12 px-6 font-medium text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Message Us
            </Button>
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

        {/* Additional Links */}
        <p className="mt-8 text-sm text-center text-gray-600">
          Need more help? Visit our{" "}
          <a
            href="/support"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Support Page
          </a>
          .
        </p>
      </div>
    </div>
  );
}
