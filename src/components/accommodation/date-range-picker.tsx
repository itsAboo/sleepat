"use client";

import React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose, PopoverPortal } from "@radix-ui/react-popover";

interface DatePickerProps {
  className?: string;
  date: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
  disabledDates?: Date[];
  isError?: boolean;
}

export default function DateRangePicker({
  className,
  date,
  onSelect,
  disabledDates,
  isError,
}: DatePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger>
          <div
            id="date"
            className={cn(
              "w-full flex justify-start items-center border p-2 rounded-md text-left font-normal",
              !date && "text-muted-foreground",
              isError && "border-destructive"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverContent
            className="sm:w-auto sm:h-auto top-0 sm:relative sticky w-screen  p-0 flex flex-col items-end"
            align="center"
          >
            <Calendar
              className="w-full h-full  flex justify-center"
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              fromDate={new Date()}
              selected={date}
              onSelect={onSelect}
              disabled={disabledDates!}
              numberOfMonths={2}
            />
            <PopoverClose className="sm:mr-3 mr-6 mb-2 sm:mb-3">
              <p className="hover:bg-primary/20 rounded-md p-2">Close</p>
            </PopoverClose>
          </PopoverContent>
        </PopoverPortal>
      </Popover>
    </div>
  );
}
