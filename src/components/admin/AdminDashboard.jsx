import React, { useEffect, useState } from 'react';
import Header from './Header';
import SideBars from './SideBars';
import { getNumberOfPatnersAPI, getNumberOfStationAPI, getNumberOfUserAPI } from '../../Server/allAPI';
import Chart from '../../pages/admin/chart&garph/Chart';
import { XIcon, Menu } from 'lucide-react'
const AdminDashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [patnerCount, setPatnerCount] = useState(0);
  const [stationCount, setStationCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    getUserAllCount();
    getpanterAllCount();
    getStationAllCount();
  }, []);

  const getUserAllCount = async () => {
    try {
      const result = await getNumberOfUserAPI();
      if (result.data !== undefined) {
        setUserCount(result.data.conunt);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getStationAllCount = async () => {
    try {
      const result = await getNumberOfStationAPI();
      if (result.data !== undefined) {
        setStationCount(result.data.conunt);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getpanterAllCount = async () => {
    try {
      const result = await getNumberOfPatnersAPI();
      if (result.data !== undefined) {
        setPatnerCount(result.data.conunt);
      }
    } catch (err) {
      console.log(err);
    }
  };



  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen font-[Dm_Sans] flex flex-col md:flex-row bg-black">
      {/* Mobile Sidebar Toggle */}
      <header className=' flex z-40 w-full md:hidden  justify-between items-center px-4 py-3 bg-zinc-950'>
        <div>
          <i className="fa-solid fa-bolt text-lg md:text-xl" style={{ color: "#f0efef" }}></i><span className="text-lg md:text-2xl font-bold  text-white"><span className='text-green-600'>Volt</span>Spot</span>
        </div>
        <div>
          <button
            className="z-50 bg-zinc-900 p-2 rounded-md text-white"
            onClick={toggleSidebar}
          >
            {!sidebarOpen ? (<Menu className='' />) : (<XIcon />)}
          </button>
        </div>
      </header>

      {/* Sidebar - Hidden on mobile by default, shown when toggled */}
      <div
        className={`
    fixed
    top-0
    left-0
    z-40
    h-screen
    transition-transform
    duration-300
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
    md:static
  `}
      >
        <SideBars />
      </div>

      {/* Main Content */}
      <div className="flex-1 h-screen overflow-y-auto custom-scroll  px-4 pb-2 pt-6 sm:px-6 lg:px-10 lg:pt-10 w-full">
        {/* Header */}
        <Header />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-zinc-900 border border-zinc-800 p-4 md:p-6 hover:border-green-500/30 transition ease-in-out rounded-xl">
            <div className="text-gray-400 mb-1  text-sm md:text-base">Total Users</div>
            <div className="text-3xl font-bold mb-1 text-white">{userCount}</div>
            <div className="text-emerald-500 text-xs md:text-sm">↑ 15% this week</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-4 md:p-6 hover:border-green-500/30 transition ease-in-out rounded-xl">
            <div className="text-gray-400 mb-1 text-sm  md:text-base">Total patners</div>
            <div className="text-3xl font-bold mb-1 text-white">{patnerCount}</div>
            <div className="text-emerald-500 text-xs md:text-sm">↑ 2% this week</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-4 md:p-6 hover:border-green-500/30 transition ease-in-out  rounded-xl sm:col-span-2 md:col-span-1">
            <div className="text-gray-400 mb-1 text-sm md:text-base">Total Ev-Stations</div>
            <div className="text-3xl font-bold mb-1 text-white">{stationCount}</div>
            <div className="text-emerald-500 text-xs md:text-sm">↑2% this month</div>
          </div>
        </div>

        {/* Charts */}
        <Chart />
      </div>
    </div>
  );
};

export default AdminDashboard;