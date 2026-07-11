import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const getInitialTheme = () => {
  const saved = localStorage.getItem("theme");
  if (saved) return saved === "dark";
  // No saved preference yet — default to dark mode.
  return true;
};

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(getInitialTheme);

  // Make sure the `dark` class on <html> actually matches state as soon
  // as this component mounts — this is what makes "default dark" work,
  // since nothing else was applying the class on first load before.
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = !isDark;

    // Apply instantly — no waiting on useEffect/render cycle
    if (next) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    setIsDark(next);
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary hover:bg-muted transition-colors duration-150 cursor-pointer"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="h-4 w-4 text-foreground" /> : <Moon className="h-4 w-4 text-foreground" />}
    </button>
  );
};

export default ThemeToggle;