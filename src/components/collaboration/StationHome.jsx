import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import StationListPage from '../../pages/collaboration/StationListPage';
import AddStationpage from '../../pages/collaboration/AddStationpage';
import Headerr from './Headerr';
import socket from '../../Server/socket';
import {  Menu,XIcon} from 'lucide-react';

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
    <div className="min-h-screen  font-[DM_Sans] overflow-hidden bg-black flex flex-col  md:flex-row">
      {/* Mobile Sidebar Toggle */}

      <header className=' flex z-40 w-full md:hidden  justify-between items-center px-4 py-3 bg-zinc-950'>
        <div>
           <i className="fa-solid fa-bolt text-lg md:text-xl" style={{color: "#f0efef"}}></i><span className="text-lg md:text-2xl font-bold  text-white"><span className='text-green-600'>Volt</span>Spot</span>
        </div>
        <div>
          <button
            className="z-50 bg-zinc-900 p-2 rounded-md text-white"
            onClick={toggleSidebar}
          >
            {!sidebarOpen ? (<Menu className=''/>):(<XIcon/>)}
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
  <Sidebar />
</div>

      {/* Main Content */}
      <div className="flex-1 h-screen  overflow-y-auto custom-scroll  px-4 pb-2 pt-6 sm:px-6 lg:px-10 lg:pt-10  min-w-0">
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