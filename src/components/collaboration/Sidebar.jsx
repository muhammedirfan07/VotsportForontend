import React from 'react';
import { Bell , MapPinHouse, Menu,ChartColumnIncreasing,User,ChartArea   } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
const Sidebar = () => {
  const location = useLocation();
  
  // Check if current path matches the link path
  const isActive = (path) => {
    return location.pathname === path;
  };
  return (
    <>
      <div className="w-64 sticky max-w-full top-0 font-[Dm_Sans] border-r border-r-zinc-900 z-50  backdrop-blur-xl px-5 py-7  bg-neutral-950 rounded-e-lg  min-h-screen overflow-y-auto">
      <div className="flex items-center ps-7 md:ps-0 gap-1 mb-6 md:mb-8">
        <i className="fa-solid fa-bolt text-xl" style={{color: "#f0efef"}}></i><span className="text-2xl font-bold  text-white"><span className='text-green-600'>Volt</span>Spot</span>
      </div>

      <nav className="space-y-1 mt-10 md:space-y-2">
        <Link to="/patnerDashboard">
          <button className={`w-full flex items-center mb-3 gap-2 md:gap-3 font-semibold  px-2 md:px-3 py-3 text-sm  rounded-2xl ${isActive('/patnerDashboard') ? 'bg-green-500/10 border-l-4 border-emerald-500 pl-4 text-emerald-500' : 'text-gray-300 hover:bg-zinc-900'}`}>
          <MapPinHouse className=" ms-2 w-5 h-5" /> Stations
          </button>
        </Link>
        <Link to="/PartnerProfile">
          <button className={`w-full font-semibold flex items-center gap-2 md:gap-3 mb-2  px-2 md:px-3 py-3  text-sm  rounded-2xl ${isActive('/PartnerProfile') ? 'bg-green-500/10 border-l-4 border-emerald-500 pl-4 text-emerald-500' : 'text-gray-300 hover:bg-zinc-900'}`}>
          <User className=" ms-2 w-5 h-5" /> Profile
          </button>
        </Link> 
        <Link to="/BookingCharts">
          <button className={`w-full font-semibold flex items-center gap-2 md:gap-3 mb-2  px-2 md:px-3 py-3  text-sm  rounded-2xl ${isActive('/BookingCharts') ? 'bg-green-500/10 border-l-4 border-emerald-500 pl-4 text-emerald-500' : 'text-gray-300 hover:bg-zinc-900'}`}>
          <ChartColumnIncreasing className=" ms-2 w-5 h-5" /> Booking Charts
          </button>
        </Link> 
        <Link to="#">
          <button className={`w-full font-semibold flex items-center gap-2 md:gap-3 mb-2  px-2 md:px-3 py-3  text-sm  rounded-2xl ${isActive('/#') ? 'bg-green-500/10 border-l-4 border-emerald-500 pl-4 text-emerald-500' : 'text-gray-300 hover:bg-zinc-900'}`}>
          <ChartArea className=" ms-2 w-5 h-5" /> Payments
          </button>
        </Link> 
        <Link to="/notifation">
          <button className={`w-full font-semibold flex items-center gap-2 md:gap-3 mb-2  px-2 md:px-3 py-3  text-sm  rounded-2xl ${isActive('/notifation') ? 'bg-green-500/10 border-l-4 border-emerald-500 pl-4 text-emerald-500' : 'text-gray-300 hover:bg-zinc-900'}`}>
          <Bell  className=" ms-2 w-5 h-5" /> Notification
          </button>
        </Link> 
      </nav>
    </div>
    </>
  )
}

export default Sidebar