"use client";

import { useState } from "react";
import Image from "next/image";

interface Tutor {
  id: string;
  name: string;
  subject: string;
}

const mockTutors: Tutor[] = [
  { id: "1", name: "Sarah Johnson", subject: "Mathematics" },
  { id: "2", name: "Mike Williams", subject: "Science" },
];

const Tutors: React.FC = () => {
  const [tutors] = useState<Tutor[]>(mockTutors);
  const [loading] = useState<boolean>(false);

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
        <span className="text-xl font-semibold bg-white px-5 py-2 rounded-full shadow-sm">
          {tutors.length ? "Your Tutors" : "No Tutors"}
        </span>
        <button
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          onClick={() => {
            /* Add tutor management logic */
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

      {tutors.length === 0 ? (
        <div className="rounded-2xl p-6 border border-gray-300 text-center">
          <div className="flex flex-col items-center gap-3">
            <p className="text-xl font-semibold text-gray-400">
              No tutors assigned
            </p>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
              onClick={() => {
                /* Add tutor assignment logic */
              }}
            >
              Assign Tutor
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {tutors.map((tutor) => (
            <div
              key={tutor.id}
              className="rounded-2xl p-4 border border-gray-300 hover:border-blue-500 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Image
                    src="/avatar.png"
                    alt={tutor.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium">{tutor.name}</p>
                    <p className="text-sm text-gray-600">
                      {tutor.subject} Tutor
                    </p>
                  </div>
                </div>
                <button
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-full transition-colors"
                  onClick={() => {
                    alert("Tutor details clicked");
                  }}
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tutors;
