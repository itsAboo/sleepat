import React from "react";
import { X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { Button } from "../ui/button";

interface FullScreenDateRangePickerProps {
  isOpen: boolean;
  onClose: () => void;
  date: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
  disabledDates?: Date[];
}

export default function FullScreenDateRangePicker({
  isOpen,
  onClose,
  date,
  onSelect,
  disabledDates,
}: FullScreenDateRangePickerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background z-[60] overflow-y-auto">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Select Date</h2>
          <Button variant="ghost" onClick={onClose} className="p-2">
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex-grow flex flex-col justify-center items-center p-4">
          <Calendar
            className="w-full max-w-md flex justify-center"
            mode="range"
            defaultMonth={date?.from}
            fromDate={new Date()}
            selected={date}
            onSelect={onSelect}
            disabled={disabledDates}
            numberOfMonths={1}
          />
          <div>
            <Button onClick={onClose}>Confirm</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
