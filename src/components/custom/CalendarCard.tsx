"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Calendar as CalendarIcon } from "lucide-react";

export default function CalendarCard() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Card className="p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xl font-semibold bg-white px-5 py-2 rounded-full shadow-sm">
          Schedule
        </span>
        <Button variant="outline" size="icon">
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
            className="rounded-md border shadow-sm p-2"
          />
        </div>
        <Button className="mt-3 w-full max-w-sm">Confirm Date</Button>
      </div>
    </Card>
  );
}
