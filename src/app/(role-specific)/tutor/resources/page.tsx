"use client";

import * as React from "react";
import { BookOpen, Video, GraduationCap, Users, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function TutorTraining() {
  const router = useRouter();

  return (
    <div className="min-h-[100dvh] bg-linear-to-b from-white to-gray-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Tutor Training Portal
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Resources and guides to help you become an exceptional tutor
          </p>
        </div>

        {/* Getting Started Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Getting Started
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start space-x-4 p-6 rounded-lg bg-blue-50 shadow-xs">
              <GraduationCap className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="text-lg font-medium text-gray-800">
                  Core Training
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Essential training videos and materials for new tutors
                </p>
                <Button
                  onClick={() => router.push("/training/core")}
                  className="w-full h-10 font-medium text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
                >
                  Start Training
                </Button>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 rounded-lg bg-blue-50 shadow-xs">
              <Users className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="text-lg font-medium text-gray-800">
                  Best Practices
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Learn proven tutoring techniques and engagement strategies
                </p>
                <Button
                  onClick={() => router.push("/training/best-practices")}
                  className="w-full h-10 font-medium text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
                >
                  View Guide
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Resource Library */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Resource Library
          </h2>
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-white shadow-xs border border-gray-100">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Video Resources
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Video className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">
                      Effective Communication in Online Tutoring
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() =>
                      window.open("https://youtu.be/example1", "_blank")
                    }
                    className="h-8 px-3 text-sm"
                  >
                    Watch
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Video className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">
                      Engaging Students in Virtual Learning
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() =>
                      window.open("https://youtu.be/example2", "_blank")
                    }
                    className="h-8 px-3 text-sm"
                  >
                    Watch
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-white shadow-xs border border-gray-100">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Downloadable Materials
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">
                      Student Assessment Templates
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/resources/templates")}
                    className="h-8 px-3 text-sm"
                  >
                    Download
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">
                      Lesson Planning Guide
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/resources/planning")}
                    className="h-8 px-3 text-sm"
                  >
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Quick Tips
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Building Rapport</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                • Start sessions with casual conversation • Show genuine
                interest in student&apos;s progress • Celebrate small wins and
                improvements • Maintain a positive and encouraging tone
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Management</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                • Set clear goals at the start • Use time management techniques
                • Provide regular progress updates • End with actionable
                takeaways
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Support Section */}
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Need Additional Support?
          </h2>
          <Button
            onClick={() => router.push("/support")}
            variant="outline"
            className="h-12 px-6 font-medium text-blue-600 bg-white rounded-lg border border-blue-200 shadow-xs transition-all hover:bg-blue-50"
          >
            Contact Tutor Support
          </Button>
        </div>
      </div>
    </div>
  );
}
