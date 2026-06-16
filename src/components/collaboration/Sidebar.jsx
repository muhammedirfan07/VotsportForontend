import React from 'react';
import { BadgeIndianRupee, MapPinHouse, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
const Sidebar = () => {
  const location = useLocation();
  
  // Check if current path matches the link path
  const isActive = (path) => {
    return location.pathname === path;
  };
  return (
    <>
      <div className="w-64 sticky max-w-full top-0 font-[Dm_Sans] border-r border-r-zinc-900  px-5 py-7  bg-neutral-950 rounded-e-lg  min-h-screen overflow-y-auto">
      <div className="flex items-center ps-14 md:ps-0 gap-1 mb-6 md:mb-8">
        <i className="fa-solid fa-bolt text-lg md:text-xl" style={{color: "#f0efef"}}></i><span className="text-lg md:text-2xl font-bold  text-white"><span className='text-green-600'>Volt</span>Spot</span>
      </div>

      <nav className="space-y-1 mt-10 md:space-y-2">
        <Link to="/patnerDashboard">
          <button className={`w-full flex items-center mb-3 gap-2 md:gap-3 font-semibold  px-2 md:px-3 py-3 text-sm  rounded-2xl ${isActive('/patnerDashboard') ? 'bg-green-500/10 border-l-4 border-green-500 pl-4 text-green-500' : 'text-gray-300 hover:bg-zinc-900'}`}>
          <MapPinHouse className=" ms-2 w-5 h-5" /> Stations
          </button>
        </Link>
        <Link to="/notifation">
          <button className={`w-full font-semibold flex items-center gap-2 md:gap-3 mb-2  px-2 md:px-3 py-3  text-sm  rounded-2xl ${isActive('/notifation') ? 'bg-green-500/10 border-l-4 border-green-500 pl-4 text-green-500' : 'text-gray-300 hover:bg-zinc-900'}`}>
          <BadgeIndianRupee className=" ms-2 w-5 h-5" /> Notification
          </button>
        </Link> 
      </nav>
    </div>
    </>
  )
}

export default Sidebar