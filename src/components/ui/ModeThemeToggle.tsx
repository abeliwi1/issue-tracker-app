import React, { useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useBoardStore } from "@/store/board-store";

export const ModeThemeToggle: React.FC = () => {
    const theme = useBoardStore((s) => s.theme);
    const toggleTheme = useBoardStore((s) => s.toggleTheme);

    // Sync the data-theme attribute on <html> whenever theme changes
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    return (
        <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="
        relative w-8 h-8 flex items-center justify-center rounded-md
        text-[var(--text-muted)] hover:text-[var(--text-secondary)]
        hover:bg-[var(--bg-hover)] transition-colors
      "
        >
            <Sun
                className={`
          absolute w-4 h-4 transition-all duration-200
          ${theme === "dark" ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"}
        `}
            />
            <Moon
                className={`
          absolute w-4 h-4 transition-all duration-200
          ${theme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}
        `}
            />
        </button>
    );
};