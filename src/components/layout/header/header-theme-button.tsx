"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function HeaderThemeButton() {
  const { theme, setTheme } = useTheme();
  const handleChangeTheme = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };
  return (
    <div className="flex items-center w-full" onClick={handleChangeTheme}>
      <Sun className="absolute mr-2 size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <Moon className="size-4 mr-2 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      {theme === "dark" ? "Light" : "Dark"}
      {" Mode"}
    </div>
  );
}
