import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
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
        <div className=" bg-zinc-950 border border-zinc-900 mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-3xl px-5 py-5 sm:px-7">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500 font-semibold ">Dashboard</p>
            <h1 className="mt-1 truncate text-white text-2xl font-bold sm:text-3xl">Partner Page</h1>
          </div>
          <div className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)}
               className="flex shrink-0 items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-800/60 px-3 py-2 text-sm font-medium text-gray-300 transition hover:bg-zinc-800 sm:px-4">
                <span className="hidden sm:inline">Account</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-28 md:w-32 bg-zinc-900 border border-zinc-800 shadow-xl rounded-2xl py-1 md:py-2 z-50">
                      <button
                        className="w-full text-center px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base font-bold text-white hover:text-gray-500 transition delay-150 duration-300 ease-in-out"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
          </div>
        </div>
        </div>
  );
};

export default Header;