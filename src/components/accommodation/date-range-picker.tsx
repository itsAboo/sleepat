"use client";

import React, { useCallback, useState, useEffect } from "react";
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
import FullScreenDateRangePicker from "./full-screen-date-range-picker";

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
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 640);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleClick = useCallback(() => {
    if (isMobile) {
      setIsFullScreenOpen(true);
    } else {
      setIsPopoverOpen(true);
    }
  }, [isMobile]);

  const handleSelect = (newDate: DateRange | undefined) => {
    onSelect(newDate);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <button
            id="date"
            onClick={handleClick}
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
          </button>
        </PopoverTrigger>
        {!isMobile && (
          <PopoverPortal>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="range"
                defaultMonth={date?.from}
                fromDate={new Date()}
                selected={date}
                onSelect={handleSelect}
                disabled={disabledDates}
                numberOfMonths={2}
              />
              <PopoverClose className="flex justify-end w-full">
                <p className="hover:bg-primary/20 rounded-md p-2">Close</p>
              </PopoverClose>
            </PopoverContent>
          </PopoverPortal>
        )}
      </Popover>

      <FullScreenDateRangePicker
        isOpen={isFullScreenOpen}
        onClose={() => setIsFullScreenOpen(false)}
        date={date}
        onSelect={handleSelect}
        disabledDates={disabledDates}
      />
    </div>
  );
}
