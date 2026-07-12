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
    <div className="min-h-screen bg-background overflow-hidden flex flex-col md:flex-row">
      {/* Mobile Sidebar Toggle */}
     <header className=' flex z-0 w-full md:hidden  justify-between border border-b-border items-center px-4 py-3 bg-card'>
        <div>
           <i className="fa-solid fa-bolt text-lg md:text-xl text-foreground"></i><span className="text-lg md:text-2xl font-bold  text-foreground"><span className='text-primary'>Volt</span>Spot</span>
        </div>
        <div>
          <button
            className="z-50 bg-secondary p-2 rounded-md text-secondary-foreground"
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
              <h2 className="text-xl text-foreground font-bold sm:text-2xl">Notifications</h2>
              <p className='text-sm mt-2 text-muted-foreground font-semibold'>
                {loading ? "Loading..." : (
                  <>{notifications?.length} <span>updates from the VoltSpot team</span></>
                )}
              </p>
            </div>
            <div className='shrink-0'>
              <button
                onClick={handleClearAllNotifications}
                disabled={loading || clearingAll || notifications.length === 0}
                className="bg-secondary border border-border flex items-center gap-2 justify-center px-4 py-2 text-foreground text-sm cursor-pointer rounded-2xl hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {clearingAll && <Loader2 className="w-4 h-4 animate-spin" />}
                {clearingAll ? "Clearing..." : "Clear all"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className=" bg-card border border-border  overflow-hidden rounded-3xl">

              {/* Loading state */}
              {loading && (
                <div className="flex flex-col items-center justify-center gap-3 py-16 px-6">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-muted-foreground text-sm font-medium">Loading notifications...</p>
                </div>
              )}

              {/* Empty state */}
              {!loading && notifications.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-3 py-16 px-6">
                  <div className="w-12 h-12 rounded-full border border-border bg-secondary flex items-center justify-center">
                    <BellOff className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-sm font-medium">No notifications yet</p>
                </div>
              )}

              {/* Notifications list */}
              {!loading && notifications?.map((notification) => (
                <div key={notification?._id} className="px-3 sm:px-6 py-4 border-b border-border last:border-b-0">
                  <div className='flex flex-col sm:grid sm:grid-cols-[auto_minmax(0,1fr)] gap-2 sm:gap-0'>
                    <div className="flex sm:block px-0 sm:px-4 py-0 sm:py-5">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-primary/20 bg-primary/10 flex items-center justify-center shrink-0">
                        <CircleAlert className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 mb-2'>
                        <div className='flex flex-wrap gap-2 sm:gap-4 items-center min-w-0'>
                          <h3 className="text-muted-foreground font-semibold text-base sm:text-xl uppercase truncate max-w-[160px] xs:max-w-none">
                            {notification?.stationId?.stationName}
                          </h3>
                          <p
                            className={`text-xs  px-3 py-0.5 items-center rounded-2xl shrink-0 whitespace-nowrap  ${notification?.status === "approved"
                              ? "text-primary border border-primary/30  bg-primary/10 "
                              : notification?.status === "rejected"
                                ? "text-destructive border border-destructive/20 bg-destructive/10"
                                : "text-muted-foreground"
                              }`}
                          >
                            {notification?.status}
                          </p>
                        </div>
                        <p className='text-xs text-muted-foreground shrink-0'>{format(notification?.createdAt)}</p>
                      </div>
                      <p className='text-muted-foreground text-sm font-semibold mb-3 sm:mb-2 break-words'>{notification?.message}</p>
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDeleteNotification(notification?._id)}
                          disabled={deletingId === notification?._id}
                          className="flex items-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/10 px-2 py-1.5 text-sm font-medium text-destructive transition hover:bg-destructive/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === notification?._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          {deletingId === notification?._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
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