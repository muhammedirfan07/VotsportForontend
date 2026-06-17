import React from 'react'
import { Users, FileText, Handshake, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const SideBars = () => {
  const location = useLocation();
  
  // Check if current path matches the link path
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 sticky max-w-full top-0 font-[Dm_Sans] border-r border-r-zinc-900 z-50  backdrop-blur-xl px-5 py-7  bg-neutral-950 rounded-e-lg  min-h-screen overflow-y-auto">
      <div className="flex items-center ps-7 md:ps-0 gap-1 mb-6 md:mb-8">
        <i className="fa-solid fa-bolt text-xl" style={{color: "#f0efef"}}></i><span className="text-2xl font-bold  text-white"><span className='text-green-600'>Volt</span>Spot</span>
      </div>

      <nav className="space-y-1 md:space-y-2">
        <Link to="/AdminDashboard">
          <button className={`w-full flex items-center mb-3 gap-2 md:gap-3 font-semibold  px-2 md:px-3 py-3 text-sm  rounded-2xl ${isActive('/AdminDashboard') ? 'bg-green-500/10 border-l-4 border-emerald-500 pl-4 text-emerald-500' : 'text-gray-300 hover:bg-zinc-900'}`}>
            <LayoutDashboard className="w-4 h-4 md:w-5 md:h-5" />
            Dashboard
          </button>
        </Link>
        <Link to="/allUsers">
          <button className={`w-full flex items-center mb-3 gap-2 md:gap-3 font-semibold  px-2 md:px-3 py-3 text-sm  rounded-2xl ${isActive('/allUsers') ? 'bg-green-500/10 border-l-4 border-emerald-500 pl-4 text-emerald-500' : 'text-gray-300 hover:bg-zinc-900'}`}>
            <Users className="w-4 h-4 md:w-5 md:h-5" />
            All Users
          </button>
        </Link>
        <Link to="/EVstations">
          <button className={`w-full flex items-center mb-3 gap-2 md:gap-3 font-semibold  px-2 md:px-3 py-3 text-sm  rounded-2xl ${isActive('/EVstations') ? 'bg-green-500/10 border-l-4 border-emerald-500 pl-4 text-emerald-500' : 'text-gray-300 hover:bg-zinc-900'}`}>
            <FileText className="w-4 h-4 md:w-5 md:h-5" />
            EV Stations
          </button>
        </Link>
        <Link to="/allPaterns">
          <button className={`w-full flex items-center mb-3 gap-2 md:gap-3 font-semibold  px-2 md:px-3 py-3 text-sm  rounded-2xl ${isActive('/allPaterns') ? 'bg-green-500/10 border-l-4 border-emerald-500 pl-4 text-emerald-500' : 'text-gray-300 hover:bg-zinc-900'}`}>
            <Handshake className="w-4 h-4 md:w-5 md:h-5" />
            All Partners
          </button>
        </Link>
      </nav>
    </div>
  )
}

export default SideBars