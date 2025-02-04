"use client";

import React from "react";
import { BarChart, CheckCircle, AlertCircle, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Assignment {
  id: number;
  title: string;
  dueDate: string;
  progress: number; // Progress in percentage
  status: "completed" | "in-progress" | "overdue";
}

export default function ProgressPage() {
  const assignments: Assignment[] = [
    {
      id: 1,
      title: "Math Homework",
      dueDate: "Jan 5, 2024",
      progress: 100,
      status: "completed",
    },
    {
      id: 2,
      title: "History Project",
      dueDate: "Jan 10, 2024",
      progress: 65,
      status: "in-progress",
    },
    {
      id: 3,
      title: "Science Lab Report",
      dueDate: "Jan 3, 2024",
      progress: 45,
      status: "overdue",
    },
  ];

  return (
    <div className="max-w-full h-screen mx-auto p-6 bg-gray-50 flex flex-col">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart className="w-6 h-6 text-green-600" />
          <h1 className="text-xl font-semibold text-gray-900">
            Student Progress
          </h1>
        </div>
        <p className="text-gray-600 text-sm">
          Track your assignments and stay on top of deadlines.
        </p>
      </div>

      <Card className="shadow-xs rounded-lg flex-1 overflow-hidden bg-white">
        <div className="p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Assignments</h2>
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="p-4 rounded-lg shadow-xs border border-gray-200 bg-white flex items-start gap-4"
              >
                <div className="flex flex-col w-full">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-md font-medium text-gray-900">
                      {assignment.title}
                    </h3>
                    <div
                      className={`flex items-center gap-1 text-sm ${
                        assignment.status === "completed"
                          ? "text-green-600"
                          : assignment.status === "overdue"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {assignment.status === "completed" && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      {assignment.status === "overdue" && (
                        <AlertCircle className="w-4 h-4" />
                      )}
                      {assignment.status === "in-progress" && (
                        <Calendar className="w-4 h-4" />
                      )}
                      {assignment.status.replace("-", " ")}
                    </div>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm text-gray-500">
                      Due: {assignment.dueDate}
                    </span>
                  </div>
                  <Progress value={assignment.progress} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="mt-6">
        <Button variant="default" className="w-full">
          Add New Assignment
        </Button>
      </div>
    </div>
  );
}
