import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/collaboration/Sidebar';
import Headerr from '../../components/collaboration/Headerr';
import socket from '../../Server/socket';
import {
  viewNotificationsAPI,
  deleteNotificationAPI,
  deleteAllNotificationsAPI,
} from '../../Server/allAPI';
import { CircleAlert, Trash2, Menu, XIcon, Loader2, BellOff } from "lucide-react"
import { format } from "timeago.js";

const Notification = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [clearingAll, setClearingAll] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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
    setLoading(true);
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
      setNotifications([]); 
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      console.log("inside the handle delete notification ...........");
      setDeletingId(notificationId);
      try {
        const token = sessionStorage.getItem("PartnerToken");
        const reqHeader = { Authorization: `Bearer ${token}` };
        const result = await deleteNotificationAPI(notificationId, reqHeader);
        if (result.status === 200) {
          setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
        }
      } catch (error) {
        console.log('Error deleting notification:', error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleClearAllNotifications = async () => {
    if (window.confirm("Are you sure you want to delete all notifications?")) {
      console.log("inside the all delete notifications..............");
      setClearingAll(true);
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
      } finally {
        setClearingAll(false);
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
          <section className=" bg-zinc-950 border mb-6 border-zinc-900 flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="min-w-0">
            <h1 className="text-lg text-white font-semibold">Partner Profile</h1>
            <p className="mt-1 text-sm text-gray-500">
              Your account identity and contact details.
            </p>
          </div>
        </section>

        {/* Stats Cards */}
        <div className='space-x-6'>
          <div className="flex w-full justify-between items-center gap-3  md:gap-6 mb-6 md:mb-4">
          
            <div className='shrink-0'>
             
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className=" bg-zinc-950 border border-zinc-800  overflow-hidden rounded-3xl">

              {/* Loading state */}
          
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;