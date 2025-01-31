"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, TrendingUp, Award } from "lucide-react";

const Progress = () => {
  const [loading] = useState(false);

  if (loading) {
    return (
      <div className="p-4 flex-1 animate-pulse">
        <div className="h-8 bg-gray-200 rounded-full w-64 mb-4"></div>
        <div className="h-40 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="p-4 flex-1">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xl font-semibold bg-white px-5 py-2 rounded-full shadow-xs">
          Learning Progress
        </span>
        <button
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          onClick={() => {
            /* Add progress options logic */
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

      <div className="rounded-2xl border border-gray-300 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600">November 10th, 2024</span>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold">Progress Update</h2>
        </div>

        <div className="rounded-2xl bg-blue-50 p-6 text-center">
          <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Great Progress!
          </h3>
          <p className="text-gray-600">
            You completed your tutoring session last week
          </p>
          <button
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            onClick={() => {
              /* Add view details logic */
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Progress;
