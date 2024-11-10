"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const Calendar1 = () => {
  const [value, onChange] = useState<Value>(new Date());
  return (
    <div className="rounded-2xl bg-gray-100 p-4 flex-1">
      <div className="bg-SkyBlue p-4 rounded">
        <Calendar onChange={onChange} value={value} />
      </div>
    </div>
  );
};

export default Calendar1;
