import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/collaboration/Sidebar';
import Headerr from '../../components/collaboration/Headerr';
import socket from '../../Server/socket';
import {
  viewNotificationsAPI,
  deleteNotificationAPI,
  deleteAllNotificationsAPI,
} from '../../Server/allAPI';
import { CircleAlert, Trash2,Menu,XIcon } from "lucide-react"
import { format } from "timeago.js";

const Notification = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    fetchNotifications();
    socket.on('notification', (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.off('notification');
    };
  }, []);

  const fetchNotifications = async () => {
    console.log("Inside fetchNotifications...");
    try {
      const token = sessionStorage.getItem("PartnerToken");
      const reqHeader = { Authorization: `Bearer ${token}` };
      const result = await viewNotificationsAPI(reqHeader);
      if (result.status === 200) {
        const notificationsArray = Array.isArray(result.data) ? result.data : [];
        console.log("Notifications:", notificationsArray);
        setNotifications(notificationsArray);
        setUnreadCount(notificationsArray.filter((n) => n.status === "unread").length);
      }
    } catch (error) {
      console.log("Error fetching notifications:", error);
      setNotifications([]); // Set to empty array in case of error
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      console.log("inside the handle delete notification ...........");
      try {
        const token = sessionStorage.getItem("PartnerToken");
        const reqHeader = { Authorization: `Bearer ${token}` };
        const result = await deleteNotificationAPI(notificationId, reqHeader);
        if (result.status === 200) {
          setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
        }
      } catch (error) {
        console.log('Error deleting notification:', error);
      }
    }
  };

  const handleClearAllNotifications = async () => {
    if (window.confirm("Are you sure you want to delete all notifications?")) {
      console.log("inside the all delete notifications..............");
      try {
        const token = sessionStorage.getItem("PartnerToken");
        const reqHeader = { Authorization: `Bearer ${token}` };
        const result = await deleteAllNotificationsAPI(reqHeader);
        if (result.status === 200) {
          setNotifications([]);
          setUnreadCount(0);
        }
      } catch (error) {
        console.log('Error clearing all notifications:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden flex flex-col md:flex-row">
      {/* Mobile Sidebar Toggle */}
     <header className=' flex z-0 w-full md:hidden  justify-between border border-b-zinc-900 items-center px-4 py-3 bg-zinc-950'>
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
      <div className="flex-1 h-screen overflow-y-auto p-4 md:p-8 w-full">
        {/* Header */}
        <Headerr />

        {/* Stats Cards */}
        <div className='space-x-6'>
          <div className="flex w-full justify-between items-center gap-3  md:gap-6 mb-6 md:mb-4">
            <div>
              <h2 className="text-xl text-white font-bold sm:text-2xl">Notifications</h2>
              <p className='text-sm mt-2 text-gray-500 font-semibold'>{notifications?.length} <span> updates from the VoltSpot team</span></p>
            </div>
            <div className='shrink-0'>
              <button
                onClick={handleClearAllNotifications}
                className="bg-zinc-900 border border-zinc-800 text-center  px-4 py-2 text-amber-50 from-gray-700 to-black text-sm  cursor-pointer rounded-2xl hover:bg-zinc-800"
              >
                Clear all
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className=" bg-zinc-950 border border-zinc-800  overflow-hidden rounded-3xl">
              {notifications?.map((notification) => (
                <div key={notification?._id} className="px-6 py-4 border-b border-zinc-900">
                  <div className='grid grid-cols-[auto_minmax(0,1fr)]  '>
                    <div className="px-4 py-5">
                      <div className="w-10 h-10 rounded-full border border-green-500/20 bg-green-500/10 flex items-center justify-center">
                        <CircleAlert className="w-4 h-4 text-green-500" />
                      </div>
                    </div>
                    <div>
                      <div className='flex justify-between items-center'>
                        <div className='flex gap-4 mb-2 items-center'>
                          <h3 className="text-gray-500 font-semibold  text-xl  uppercase">{notification?.stationId?.stationName}</h3>
                          <p
                            className={`text-xs  px-3 py-0.5 items-center rounded-2xl shrink-0  ${notification?.status === "approved"
                              ? "text-green-500 border border-green-500/30  bg-green-500/10 "
                              : notification?.status === "rejected"
                                ? "text-red-500 border border-red/20 bg-red-500/10"
                                : "text-gray-500"
                              }`}
                          >
                            {notification?.status}
                          </p>
                        </div>
                        <p className='text-xs text-gray-500'> {format(notification?.createdAt)}</p>
                      </div>
                      <p className='text-gray-500 text-sm font-semibold mb-2'>{notification?.message}</p>
                      <button
                        onClick={() => handleDeleteNotification(notification?._id)}
                        className="flex items-center float-end gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-2 py-1.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;