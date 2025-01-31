"use client";

import * as React from "react";
import { Calendar } from "@/components/custom/Calendar";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Calendar as CalendarIcon } from "lucide-react";

export default function CalendarCard() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Card className="p-6 shadow-xs rounded-lg bg-linear-to-b from-white to-gray-50">
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
        {/* <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Select a Date
        </h3> */}
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
