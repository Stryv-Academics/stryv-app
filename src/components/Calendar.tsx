"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { CalendarDays } from "lucide-react";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const CalendarView = () => {
  const [value, onChange] = useState<Value>(new Date());
  const [loading] = useState(false);

  if (loading) {
    return (
      <div className="p-4 flex-1 animate-pulse">
        <div className="h-8 bg-gray-200 rounded-full w-64 mb-4"></div>
        <div className="h-96 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="p-4 flex-1">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xl font-semibold bg-white px-5 py-2 rounded-full shadow-sm flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-blue-600" />
          Schedule Overview
        </span>
      </div>

      <div className="rounded-2xl border border-gray-300 p-6">
        <style jsx global>{`
          .react-calendar {
            width: 100%;
            border: none;
            background: transparent;
            font-family: inherit;
          }

          .react-calendar__tile {
            padding: 1em 0.5em;
            border-radius: 0.5rem;
            transition: all 0.2s;
          }

          .react-calendar__tile:enabled:hover,
          .react-calendar__tile:enabled:focus {
            background-color: #e0e7ff;
          }

          .react-calendar__tile--active {
            background: #3b82f6 !important;
            color: white;
          }

          .react-calendar__tile--now {
            background: #dbeafe;
          }

          .react-calendar__navigation button {
            min-width: 44px;
            background: none;
            border-radius: 0.5rem;
            transition: all 0.2s;
          }

          .react-calendar__navigation button:enabled:hover,
          .react-calendar__navigation button:enabled:focus {
            background-color: #e0e7ff;
          }

          .react-calendar__navigation {
            margin-bottom: 1rem;
          }

          .react-calendar__month-view__weekdays {
            font-size: 0.875rem;
            font-weight: 600;
            color: #4b5563;
          }

          .react-calendar__month-view__days__day--weekend {
            color: #ef4444;
          }

          .react-calendar__month-view__days__day--neighboringMonth {
            color: #9ca3af;
          }
        `}</style>

        <div className="bg-blue-50 p-6 rounded-2xl">
          <Calendar
            onChange={onChange}
            value={value}
            className="rounded-lg"
            tileClassName="rounded-lg"
          />
        </div>

        {value instanceof Date && (
          <div className="mt-4 p-4 bg-white rounded-2xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Selected Date
            </h3>
            <p className="text-gray-600">
              {value.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
