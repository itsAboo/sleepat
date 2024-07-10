"use client";

import { useEffect } from "react";

export default function ResetZoom() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);
  return null;
}
