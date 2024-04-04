"use client";

import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { MoonIcon, SunIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

const DarkModeToggle = ({ className }: Props) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className={cn(className, "border border-slate-900 dark:border-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer")}
          onClick={() => {
            setIsDarkMode((prev) => !prev);
            document.body.classList.toggle("dark");
          }}
        >
          {isDarkMode ? <MoonIcon /> : <SunIcon />}
        </TooltipTrigger>
        <TooltipContent>
          <div>{isDarkMode ? "Enable Light Mode" : "Enable Dark Mode"}</div>{" "}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DarkModeToggle;
