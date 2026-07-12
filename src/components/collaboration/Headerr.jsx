import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, User, Sun, Moon, LogOut } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Headerr = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    sessionStorage.removeItem("PartnerToken");
    navigate("/");
  };

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = !isDark;

    if (next) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    setIsDark(next);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative font-[Dm_Sans] mb-4 md:mb-6">
      <div className="bg-card border border-border mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-3xl px-5 py-5 sm:px-7">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold">Dashboard</p>
          <h1 className="mt-1 truncate text-foreground text-2xl font-bold sm:text-3xl">Partner Page</h1>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex shrink-0 items-center gap-2 rounded-2xl border border-border bg-secondary/60 px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary sm:px-4"
          >
            <span className="hidden sm:inline">Account</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-card border border-border shadow-xl rounded-2xl py-2 z-50">
              <p className="px-4 pt-1 pb-2 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Partner
              </p>

              <button
                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer"
                onClick={() => {
                  navigate("/PartnerProfile");
                  setDropdownOpen(false);
                }}
              >
                <User className="h-4 w-4" />
                Profile
              </button>

              <button
                className="w-full flex items-center justify-between gap-2.5 px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer"
                onClick={toggleTheme}
              >
                <span className="flex items-center gap-2.5">
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  Theme
                </span>
                <span className="text-xs text-muted-foreground">
                  {isDark ? "Dark" : "Light"}
                </span>
              </button>

              <div className="my-1 border-t border-border" />

              <button
                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-destructive hover:bg-secondary transition-colors cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Headerr;