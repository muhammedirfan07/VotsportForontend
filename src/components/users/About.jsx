import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp,MapPin,Calendar,Clock,Battery } from "lucide-react";
import { viewBookingAPI } from "../../Server/allAPI";

const BookingHistory = () => {
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);

  useEffect(() => {
    viewBookingHistory();
  }, []);

  const toggleBookingDetails = (id) => {
    if (expandedBooking === id) {
      setExpandedBooking(null);
    } else {
      setExpandedBooking(id);
    }
  };

  const viewBookingHistory = async () => {
    const userData = sessionStorage.getItem("user");
    const authUser = JSON.parse(userData);
    const userId = authUser?._id;
    const token = sessionStorage.getItem("token");

    if (!token) {
      console.log("Token is not available.");
      return;
    }

    const reqHeaders = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const result = await viewBookingAPI(userId, reqHeaders);
      if (result.status === 200) {
        setBookingHistory(result.data.bookings);
        console.log("history:", result.data.bookings);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };
   const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "active":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  return (
    <div className="bg-gradient-to-t from-gray-800 to-slate-950 drop-shadow-xl rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-xl text-amber-50 font-semibold">Booking History</h2>
      </div>
      <div className="p-6 space-y-4">
        {bookingHistory.length > 0 ? (
          bookingHistory.map((booking) => {
            const startTime = new Date(booking.startTime);
            const endTime = new Date(booking.endTime);
            const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };

            return (
              <div
                key={booking._id}
                className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all"
              >
                <div
                  onClick={() => toggleBookingDetails(booking._id)}
                  className="cursor-pointer p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {booking.stationId?.stationName || "Unknown Station"}
                        </h3>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyles(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <MapPin size={14} className="mr-1" />
                        {booking.stationId?.city}{booking.stationId?.state ? `, ${booking.stationId?.state}` : ""}
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      {expandedBooking === booking._id ? (
                        <ChevronUp size={24} />
                      ) : (
                        <ChevronDown size={24} />
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="flex items-center text-gray-400 text-xs mb-1">
                        <Calendar size={14} className="mr-1" />
                        Date
                      </div>
                      <p className="text-white font-medium">
                        {startTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center text-gray-400 text-xs mb-1">
                        <Clock size={14} className="mr-1" />
                        Time
                      </div>
                      <p className="text-white font-medium">
                        {startTime.toLocaleTimeString([], timeOptions)}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center text-gray-400 text-xs mb-1">
                        <Battery size={14} className="mr-1" />
                        Energy
                      </div>
                      <p className="text-white font-medium">
                        {booking.energy || 0} kWh
                      </p>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs mb-1">Amount</div>
                      <p className="text-green-400 font-semibold text-lg">
                        {formatCurrency(booking.totalPrice)}
                      </p>
                    </div>
                  </div>
                </div>

                {expandedBooking === booking._id && (
                  <div className="px-6 pb-6 pt-2 border-t border-gray-700">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400 mb-1">Station Name</p>
                        <p className="text-white font-medium">
                          {booking.stationId?.stationName || "Unknown Station"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Location</p>
                        <p className="text-white font-medium">
                          {`${booking.stationId?.city}${booking.stationId?.state ? `, ${booking.stationId?.state}` : ""}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Slot Number</p>
                        <p className="text-white font-medium">
                          {booking.slotNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Duration</p>
                        <p className="text-white font-medium">
                          {booking.duration} {booking.duration === 1 ? 'hour' : 'hours'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Start Time</p>
                        <p className="text-white font-medium">
                          {startTime.toLocaleTimeString([], timeOptions)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">End Time</p>
                        <p className="text-white font-medium">
                          {endTime.toLocaleTimeString([], timeOptions)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Energy Consumed</p>
                        <p className="text-white font-medium">
                          {booking.energy || 0} kWh
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Total Price</p>
                        <p className="text-green-400 font-semibold">
                          {formatCurrency(booking.totalPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-400 text-lg">No booking history available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;