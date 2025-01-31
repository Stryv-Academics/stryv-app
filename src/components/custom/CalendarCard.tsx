"use client";

import * as React from "react";
import { Calendar } from "@/components/custom/Calendar";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Calendar as CalendarIcon } from "lucide-react";
import { CalendarDatePicker } from "./CalendarDatePicker";

export default function CalendarCard() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [selectedDateRange, setSelectedDateRange] = React.useState({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  return (
    <Card className="p-6 shadow-xs rounded-lg bg-linear-to-b from-white to-gray-50">
      {/* Calendar Date Picker */}
      <div className="p-4 max-w-xl">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-semibold text-gray-900 px-5 py-2 rounded-full shadow-xs">
            Date Picker Component
          </span>
          <Button
            variant="outline"
            size="icon"
            className="hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <CalendarIcon className="w-5 h-5 text-blue-600" />
          </Button>
        </div>
        <CalendarDatePicker
          date={selectedDateRange}
          onDateSelect={setSelectedDateRange}
        />
        <div className="mt-4">
          <h2 className="text-md font-semibold">Selected Date Range:</h2>
          <p className="text-sm">
            {selectedDateRange.from.toDateString()} -{" "}
            {selectedDateRange.to.toDateString()}
          </p>
        </div>
      </div>
      {/* Calendar */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-xl font-semibold text-gray-900 px-5 py-2 rounded-full shadow-xs">
          Schedule
        </span>
        <Button
          variant="outline"
          size="icon"
          className="hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <CalendarIcon className="w-5 h-5 text-blue-600" />
        </Button>
      </div>
      <div className="rounded-lg bg-blue-50 p-4 flex flex-col items-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Select a Date
        </h3>
        <div className="w-full flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow-xs p-2"
            fixedWeeks
          />
        </div>
        <Button className="mt-3 w-full max-w-sm bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Confirm Date
        </Button>
      </div>
    </Card>
  );
}
