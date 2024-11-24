"use client";

import React from "react";
import Progress from "@/components/Progress";
import Calendar from "@/components/Calendar";
import Welcome from "@/components/Welcome";
import {
  Clock,
  GraduationCap,
  Trophy,
  Users,
  MapPin,
  Calendar as CalendarIcon,
} from "lucide-react";
import Image from "next/image";

const ProfileEntrance = () => {
  return (
    <div className="flex justify-between items-center mb-4">
      <span className="text-xl font-semibold bg-white px-5 py-2 rounded-full shadow-sm">
        Profile
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
  );
};

const ProfileStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-600">
              Hours Learned
            </span>
            <span className="text-2xl font-bold">127</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-gray-500" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-600">
              Achievements
            </span>
            <span className="text-2xl font-bold">15</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-gray-500" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-600">
              Courses Completed
            </span>
            <span className="text-2xl font-bold">8</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-500" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-600">
              Study Groups
            </span>
            <span className="text-2xl font-bold">3</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileInfo = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col items-center md:flex-row md:items-start gap-4">
        <Image
          src="/avatar.png"
          alt="Profile"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex flex-col items-center md:items-start gap-2">
          <h2 className="text-2xl font-bold">Zach Berkenkotter</h2>
          <p className="text-gray-600">Student at Wesleyan University</p>

          {/* Added location and age info */}
          <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>Middletown, CT</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <span>20 years old</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {["Python", "JavaScript", "React"].map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/*LEFT*/}
      <div className="w-full flex flex-col gap-8">
        {/*USER CARDS*/}
        <div className="flex gap-4 justify-between flex-wrap flex-col">
          <ProfileEntrance />
          <ProfileInfo />
          <ProfileStats />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
