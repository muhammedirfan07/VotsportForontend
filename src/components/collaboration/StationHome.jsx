import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import StationListPage from '../../pages/collaboration/StationListPage';
import AddStationpage from '../../pages/collaboration/AddStationpage';
import Headerr from './Headerr';
import socket from '../../Server/socket';

const StationHome = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [partnerId, setPartnerId] = useState(null);
  
  useEffect(() => {
    const storedPartnerId = sessionStorage.getItem("partnerId"); 
    console.log("Partner ID:", storedPartnerId);
  
    if (storedPartnerId) {
      setPartnerId(storedPartnerId);
      socket.emit("registerPartner", storedPartnerId);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen  font-[DM_Sans] overflow-hidden bg-black flex flex-col md:flex-row">
      {/* Mobile Sidebar Toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded-md text-white"
        onClick={toggleSidebar}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      {/* Sidebar - Hidden on mobile by default, shown when toggled */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block fixed md:static z-40 h-screen`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 h-screen overflow-y-auto  px-4 pb-16 pt-6 sm:px-6 lg:px-10 lg:pt-10  min-w-0">
        {/* Header */}
        <Headerr />

        {/* Stats Cards */}
          <section className=" bg-zinc-950 border mb-6 border-zinc-900 flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div className="min-w-0">
          <h2 className="text-lg text-white font-semibold">Add a new station</h2>
          <p className="mt-1 text-sm text-gray-500">
            Onboard a new charging point to your VoltSpot network in under a minute.
          </p>
        </div>
         <AddStationpage />
      </section>
        {/* Users Table */}
        <div className=" h-full overflow-y-auto custom-scroll">
              <StationListPage />
            </div>
      </div>
    </div>
  );
}

export default StationHome;