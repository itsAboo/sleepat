"use client";

import { Sun, Moon } from "lucide-react";
import { Button } from "./button";
import { useTheme } from "next-themes";

export default function ThemeButton({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme();
  const handleChangeTheme = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };
  return (
    <Button
      className={className}
      variant="ghost"
      onClick={handleChangeTheme}
      size="icon"
    >
      <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    </Button>
  );
}
