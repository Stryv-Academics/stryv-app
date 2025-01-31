"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar, Clock, BookOpen, GraduationCap } from "lucide-react";

interface Lesson {
  id: string;
  startTime: Date;
  endTime: Date;
  tutorName: string;
  subject: string;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  location?: string;
  progressNotes?: string;
}

interface StatusStylesMap {
  [key: string]: string;
}

// Mock data
const mockLessons: Lesson[] = [
  {
    id: "1",
    startTime: new Date("2024-11-10T10:00:00"),
    endTime: new Date("2024-11-10T11:00:00"),
    tutorName: "John Smith",
    subject: "Mathematics",
    status: "SCHEDULED",
    location: "Online",
  },
  {
    id: "2",
    startTime: new Date("2024-11-11T14:00:00"),
    endTime: new Date("2024-11-11T15:30:00"),
    tutorName: "Sarah Johnson",
    subject: "Physics",
    status: "IN_PROGRESS",
    location: "Room 204",
  },
  {
    id: "3",
    startTime: new Date("2024-11-12T09:00:00"),
    endTime: new Date("2024-11-12T10:00:00"),
    tutorName: "Mike Wilson",
    subject: "Chemistry",
    status: "COMPLETED",
    location: "Online",
    progressNotes: "Covered ionic bonds and molecular structures.",
  },
];

const Lessons: React.FC = () => {
  const [lessons] = useState<Lesson[]>(mockLessons);
  const [loading] = useState<boolean>(false);

  const getStatusStyles = (status: Lesson["status"]): string => {
    const styles: StatusStylesMap = {
      SCHEDULED: "bg-yellow-100 text-yellow-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      COMPLETED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="p-4 flex-1 animate-pulse">
        <div className="h-8 bg-gray-200 rounded-full w-64 mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-gray-200 rounded-2xl"></div>
          <div className="h-20 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 flex-1">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xl font-semibold bg-white px-5 py-2 rounded-full shadow-xs">
          {lessons.length ? "Upcoming Lessons" : "No upcoming lessons"}
        </span>
        <button
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          onClick={() => {
            /* Add lesson scheduling logic */
          }}
          aria-label="More options"
        >
          <Image
            src="/more.png"
            alt="More options"
            width={20}
            height={20}
            className="w-5 h-5"
          />
        </button>
      </div>

      {lessons.length === 0 ? (
        <div className="rounded-2xl p-6 border border-gray-300 text-center">
          <div className="flex flex-col items-center gap-3">
            <GraduationCap className="w-12 h-12 text-gray-400" />
            <p className="text-xl font-semibold text-gray-400">
              Ready to start learning?
            </p>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
              onClick={() => {
                /* Add scheduling logic */
              }}
            >
              Schedule a Lesson
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="rounded-2xl p-4 border border-gray-300 hover:border-blue-500 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="font-semibold">
                    {format(new Date(lesson.startTime), "EEEE, MMMM d")}
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusStyles(
                    lesson.status
                  )}`}
                >
                  {lesson.status.toLowerCase().replace("_", " ")}
                </span>
              </div>

              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {format(new Date(lesson.startTime), "h:mm a")} -
                    {format(new Date(lesson.endTime), "h:mm a")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{lesson.subject}</span>
                </div>
              </div>

              <div className="mt-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{lesson.tutorName}</p>
                  <p className="text-sm text-gray-600">
                    {lesson.location || "Online"}
                  </p>
                </div>
                <div className="flex gap-2">
                  {lesson.status === "COMPLETED" && lesson.progressNotes && (
                    <button
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      onClick={() => {
                        alert(lesson.progressNotes);
                      }}
                    >
                      View Progress
                    </button>
                  )}
                  <button
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-full transition-colors"
                    onClick={() => {
                      alert("Lesson details clicked");
                    }}
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Lessons;
