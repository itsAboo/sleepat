"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FormEvent, useEffect, useState } from "react";
import DateRangePicker from "../accommodation/date-range-picker";
import { DateRange } from "react-day-picker";

interface ISearchInput {
  date?: DateRange | undefined;
  keyword?: string | undefined;
}

export default function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");
  const keywordParam = searchParams.get("keyword");
  const [searchInput, setSearchInput] = useState<ISearchInput>({
    keyword: keywordParam ?? "",
    date: {
      to: toParam ? new Date(toParam) : undefined,
      from: fromParam ? new Date(fromParam) : undefined,
    },
  });

  useEffect(() => {
    if (!fromParam || !toParam) {
      setSearchInput((prev) => ({ ...prev, date: undefined }));
    }
    if (!keywordParam) {
      setSearchInput((prev) => ({ ...prev, keyword: "" }));
    }
  }, [searchParams]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    const currentSearch = new URLSearchParams(
      Array.from(searchParams.entries())
    );

    Object.entries(searchInput).forEach(([key, value]) => {
      if (key === "date" && value) {
        const dateRange = value as DateRange;
        if (dateRange.from) {
          currentSearch.set("from", dateRange.from.toISOString().split("T")[0]);
        } else {
          currentSearch.delete("from");
        }
        if (dateRange.to) {
          currentSearch.set("to", dateRange.to.toISOString().split("T")[0]);
        } else {
          currentSearch.delete("to");
        }
      } else if (value) {
        currentSearch.set(key, value.toString());
      } else {
        currentSearch.delete(key);
      }
    });

    currentSearch.delete("date");

    const search = currentSearch.toString();
    const query = search ? `?${search}` : "";
    router.push(`${window.location.pathname}${query}`);
  };

  const handleSelectDate = (range: DateRange | undefined) => {
    if (
      range?.from &&
      range.to &&
      range.from.getTime() === range.to.getTime()
    ) {
      setSearchInput((prev) => ({ ...prev, from: undefined, to: undefined }));
    } else {
      setSearchInput((prev) => ({
        ...prev,
        date: range,
      }));
    }
  };
  
  return (
    <form onSubmit={handleSearch} className="flex sm:flex-row flex-col gap-2 md:gap-4 w-full mb-4">
      <Input
        onChange={(e) =>
          setSearchInput((prev) => ({ ...prev, keyword: e.target.value }))
        }
        value={searchInput.keyword}
        name="search"
        className="w-full"
        placeholder="Search for places"
      />
      <DateRangePicker
        date={searchInput?.date}
        onSelect={handleSelectDate}
        className="w-full"
      />
      <Button type="submit">
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </span>
        Search
      </Button>
    </form>
  );
}
