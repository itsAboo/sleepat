"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.log("error ja")
    console.error(error);
  }, [error]);
  return (
    <div className="flex flex-col gap-2 justify-center items-center min-h-screen">
      <h1>Something went wrong</h1>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
