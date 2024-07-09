"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./button";
import { Input } from "./input";
import { FormEvent, useState } from "react";

export default function SearchInput() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [keyword, setKeyword] = useState("");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const currentSearch = new URLSearchParams(
      Array.from(searchParams.entries())
    );
    if (keyword) {
      currentSearch.set("keyword", keyword as string);
    } else {
      currentSearch.delete("keyword");
    }

    const search = currentSearch.toString();
    const query = search ? `?${search}` : "";
    router.push(`${window.location.pathname}${query}`);
  };

  return (
    <div className="w-[60%]">
      <form onSubmit={handleSearch} className="relative w-full">
        <Input
          onChange={(e) => setKeyword(e.target.value)}
          name="search"
          className="w-full pr-16 "
          placeholder="Search for places"
        />
        <Button
          type="submit"
          variant="ghost"
          className="absolute top-0 right-0"
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </span>
        </Button>
      </form>
    </div>
  );
}
