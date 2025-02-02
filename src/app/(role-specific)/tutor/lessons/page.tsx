"use client";

import React, { useState } from "react";
import { Book, Target, List, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Objective = string;
type Activity = {
  description: string;
  duration: string;
};

export default function LessonPlanner() {
  const [objectives, setObjectives] = useState<Objective[]>([""]);
  const [activities, setActivities] = useState<Activity[]>([
    { description: "", duration: "" },
  ]);
  const [notes, setNotes] = useState<string>("");

  const addObjective = (): void => {
    setObjectives([...objectives, ""]);
  };

  const updateObjective = (index: number, value: string): void => {
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    setObjectives(newObjectives);
  };

  const removeObjective = (index: number): void => {
    const newObjectives = objectives.filter((_, i) => i !== index);
    setObjectives(newObjectives);
  };

  const addActivity = (): void => {
    setActivities([...activities, { description: "", duration: "" }]);
  };

  const updateActivity = (
    index: number,
    field: "description" | "duration",
    value: string
  ): void => {
    const newActivities = [...activities];
    newActivities[index] = { ...newActivities[index], [field]: value };
    setActivities(newActivities);
  };

  const removeActivity = (index: number): void => {
    const newActivities = activities.filter((_, i) => i !== index);
    setActivities(newActivities);
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-white to-gray-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Lesson Planner
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Create and organize your tutoring sessions
          </p>
        </div>

        {/* Main Form */}
        <div className="space-y-8">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lesson Title
                </label>
                <Input placeholder="Enter lesson title" className="w-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <Input placeholder="Enter subject" className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade Level
                  </label>
                  <Input placeholder="Enter grade level" className="w-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Learning Objectives
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {objectives.map((objective, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={objective}
                    onChange={(e) => updateObjective(index, e.target.value)}
                    placeholder="Enter learning objective"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeObjective(index)}
                    className="shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addObjective}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Objective
              </Button>
            </CardContent>
          </Card>

          {/* Lesson Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="w-5 h-5" />
                Lesson Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={activity.description}
                      onChange={(e) =>
                        updateActivity(index, "description", e.target.value)
                      }
                      placeholder="Activity description"
                      className="flex-1"
                    />
                    <Input
                      value={activity.duration}
                      onChange={(e) =>
                        updateActivity(index, "duration", e.target.value)
                      }
                      placeholder="Duration"
                      className="w-24"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeActivity(index)}
                      className="shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addActivity}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
              </Button>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any additional notes, resources, or reminders..."
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              ></textarea>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              className="w-full flex-1 h-12 font-medium text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
              onClick={() => console.log("Saving lesson plan...")}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Lesson Plan
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-12"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
