import React, { useEffect, useState } from "react";
import { Star, ArrowBigLeftDash, TrafficCone, Zap, MessageSquarePlus } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  avilableSlotAPI,
  bookingStaionAPI,
  getSingleStaionAPI,
  paymentAPI,
} from "../../Server/allAPI";
import SERVER_URL from "../../Server/serverURL";
import { toast } from "react-toastify";
import AddReview from "./ReviewRatingPage/AddReview";
import ReviewsAndRatingPage from "./ReviewRatingPage/ReviewsAndRatingPage";

const StationDetailsPage = () => {
  const { stationId } = useParams();
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slotNumber, setSlotNumber] = useState("");
  const [duration, setDuration] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [overallRating, setOverallRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [startTime, setStartTime] = useState("")
  const navigate = useNavigate();
  const [isSlotOpen, setIsSlotOpen] = useState(false);

  const allSlots = Array.from(
    { length: station?.availableSlots || 0 },
    (_, i) => i + 1
  );


  useEffect(() => {
    singleStaionDetails();
  }, [stationId]);

  useEffect(() => {
    if (stationId && duration) {
      ViewAvilableSlots();
    }
  }, [stationId, duration]);



  const singleStaionDetails = async () => {
    try {
      const result = await getSingleStaionAPI(stationId);
      if (result.status === 200) {
        setStation(result.data);
      }
    } catch (error) {
      console.log("Error fetching station details:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallRating = (reviews) => {
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      setOverallRating(0);
      return;
    }

    const totalRating = reviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0
    );
    const averageRating = totalRating / reviews.length;
    setOverallRating(averageRating.toFixed(1));
  };


  const getRatingDistribution = (reviews) => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    reviews.forEach((r) => {
      const rating = Math.round(r.rating);
      if (counts[rating] !== undefined) {
        counts[rating]++;
      }
    });

    const total = reviews.length;

    const percentages = {};
    for (let i = 1; i <= 5; i++) {
      percentages[i] = total ? (counts[i] / total) * 100 : 0;
    }

    return percentages;
  };
  const ratingDistribution = getRatingDistribution(reviews);
  // handle fetched reviews
  const handleReviewsFetched = (reviews) => {
    setReviews(reviews);
    calculateOverallRating(reviews);
  };

  // avilable slot  viewing----
  const ViewAvilableSlots = async () => {
    const token = sessionStorage.getItem("token");

    const reqHeaders = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const currentTime = new Date().toISOString();

      const result = await avilableSlotAPI(
        currentTime,
        stationId,
        duration,
        slotNumber,
        reqHeaders
      );
      console.log("availableSlots", availableSlots);

      if (result.status === 200) {
        setAvailableSlots(result.data.availableSlots);
      }
    } catch (error) {
      console.error("Error fetching available slots:", error);
    }
  };

  // charging staion booking---
  const handleBooking = async () => {
    if (!slotNumber || duration < 1) {
      toast.warning("Please fill all required fields", {
        position: "top-center",
        theme: "dark",
      });
      return;
    }

    const userData = sessionStorage.getItem("user");
    const authUser = JSON.parse(userData);
    const userId = authUser?._id;
    if (!userId) {
      toast.error("User not found. Please log in.");
      return;
    }
    const price = station?.pricePerHour * duration;
    sessionStorage.setItem("slotNumber", slotNumber);
    sessionStorage.setItem("duration", duration);
    sessionStorage.setItem("price", price);
    sessionStorage.setItem("stationId", stationId);
    sessionStorage.setItem("userId", userId);

    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    const reqHeaders = {
      Authorization: `Bearer ${token}`,
    };

    const bookingData = {
      userId,
      stationId,
      slotNumber: parseInt(slotNumber),
      startTime: new Date().toISOString(),
      duration,
    };
    console.log("booking data :", bookingData);

    try {
      setIsSubmitting(true);
      const result = await bookingStaionAPI(bookingData, reqHeaders);
      if (result.status === 200) {
        toast.success("Booking successful!", {
          position: "top-center",
          theme: "dark",
        });

        setSlotNumber("");
        setDuration(1);
        const paymentResult = await paymentAPI(stationId, userId, price);
        console.log("Stripe Session ID:", paymentResult.data.id);
        if (paymentResult.data.id) {
          navigate(`/stripe-checkout/${paymentResult.data.id}`);
        } else {
          toast.error("Failed to initiate payment", {
            position: "top-right",
            theme: "dark",
          });
        }
      } else {
        toast.error(result.response?.data?.message || "Booking failed!", {
          position: "top-right",
          theme: "dark",
        });
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong!", {
        position: "bottom-right",
        theme: "dark",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-0 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-solid"></div>
        </div>
      )}

      {/* Main Content */}
      <main className="bg-black min-h-screen text-white p-4 md:p-8">
        <div className="container mx-auto">
          <Link to={"/home"}>
            <div className="flex text-green-700">
              <ArrowBigLeftDash /> Home
            </div>
          </Link>
          <div className="text-[#6B7280] text-4xl font-bold mb-8 uppercase">
            {station?.stationName}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Images */}
            <div className="bg-black/60  backdrop-blur-xl border border-none rounded-3xl overflow-hidden  transition-all duration-300 hover:shadow-lg  hover:shadow-green-500/40  ">
              <div className="relative  min-h-[280px] overflow-hidden">
                <img
                  src={`${SERVER_URL}/${station?.image}`}
                  alt="Charging Station"
                  className="w-full h-[400px]  object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute   inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-500">Solar Powered</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Station Info */}
            <div className="bg-white/5 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 space-y-6 shadow-xl transition-all duration-300 ">
              {/* Station Title */}
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {station?.stationName}
                </h1>

                <div className="flex items-center gap-2 text-gray-400">
                  <span className="text-sm">
                    {station?.city}, {station?.state}
                  </span>
                </div>
              </div>

              {/* Charging Type */}
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-400">Charging Type</span>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${station?.chargingType === "fast"
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    }`}
                >
                  {station?.chargingType}
                </span>
              </div>

              {/* Slot Selection */}
              <div className="space-y-3 relative">
                <label className="text-sm font-medium text-white">Available Slots</label>

                {/* Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsSlotOpen(!isSlotOpen)}
                  className="w-full h-12 bg-black/40 border border-gray-700 rounded-xl px-4 text-white focus:outline-none focus:border-green-500 transition flex items-center justify-between"
                >
                  <span className={slotNumber ? "text-white" : "text-gray-400"}>
                    {slotNumber ? `Slot ${slotNumber}` : "Select Slot"}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isSlotOpen ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Collapse Dropdown Panel */}
                <div
                  className={`absolute left-0 right-0 z-10 transition-all duration-300 ${isSlotOpen ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0 pointer-events-none"
                    }`}
                >
                  <div className="p-3 border border-gray-800 rounded-lg bg-neutral-900 shadow-lg">
                    <div className=" flex justify-between mb-2 " >
                      <h3 className="text-white font-bold mb-3 text-sm">Select a Slot</h3>
                      <button
                        type="button"
                        onClick={() => setIsSlotOpen(false)}
                        className="bg-gray-800 hover:bg-gray-700 text-white rounded-xl px-4 py-1 text-sm transition ease-in-out cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="grid grid-cols-5 gap-2 max-h-52 overflow-y-auto">
                      {Array.from({ length: station?.availableSlots || 0 }, (_, i) => (
                        <button
                          key={i + 1}
                          type="button"
                          onClick={() => {
                            setSlotNumber(String(i + 1));
                            setIsSlotOpen(false);
                          }}
                          className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 border ${slotNumber === String(i + 1)
                            ? "bg-green-600 border-green-500 text-white"
                            : "bg-black/40 border-gray-700 text-gray-300 hover:border-green-500 hover:text-white"
                            }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price + Duration + Button */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-800">
                {/* Price */}
                <div>
                  <p className="text-xs text-gray-400 mb-1">Total Price</p>
                  <div className="text-xl md:text-2xl font-bold text-white">
                    ₹ {station?.pricePerHour * duration}
                  </div>
                </div>
                {/* Duration + Button */}
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <p className="text-xs text-gray-400 mb-1">Hours</p>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={duration}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          setDuration("");
                          return;
                        }

                        let num = parseInt(value);
                        if (num < 1) num = 1;
                        if (num > 10) num = 10;

                        setDuration(num);
                      }}
                      onBlur={() => {
                        // if user leaves it empty → reset to 1
                        if (duration === "") {
                          setDuration(1);
                        }
                      }}
                      className="w-10 md:w-20 h-10 text-center bg-black/40 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                    />
                  </div>

                  <button
                    disabled={isSubmitting}
                    onClick={handleBooking}
                    className="h-12 px-8 mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {isSubmitting ? "Processing..." : "Book Now"}
                  </button>

                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="grid grid-cols-1  md:grid-cols-3  md:gap-8 mt-8">
            <div className=" col-span-2   bg-neutral-900/80 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-xl">User Reviews</h2>
                <AddReview stationId={stationId} />
              </div>
              <ReviewsAndRatingPage
                stationId={stationId}
                onReviewsFetched={handleReviewsFetched}
              />
            </div>

            {/* Overall Rating */}
            {
              reviews?.length === 0 ? (
                <div className="bg-neutral-900/50 md:mt-0 mt-5 flex flex-col  items-center rounded-xl p-6 animate-fade-up animation-delay-300">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-[hsl(158,64%,52%)]/20 blur-2xl rounded-full" />
                    <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-[hsl(0,0%,10%)] to-[hsl(0,0%,10%)]/40 border border-[hsl(0,0%,15%)]/60 flex items-center justify-center">
                      <MessageSquarePlus className="h-7 w-7 text-[hsl(0,0%,55%)]" />
                    </div>
                  </div>

                  <h4 className="text-sm font-semibold text-[hsl(0,0%,98%)] mb-1">
                    No rating exists yet
                  </h4>

                  <p className="text-xs text-[hsl(0,0%,55%)] max-w-[220px] leading-relaxed">
                    Be the first to share your experience. Add a review to start the rating.
                  </p>

                  <div className="flex gap-1 mt-4 opacity-40">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-gray-600 text-gray-600" />
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-neutral-900/50 md:mt-0 mt-5 flex flex-col  items-center rounded-xl p-6 animate-fade-up animation-delay-300">
                    <h1 className="font-bold text-2xl mb-3">Customer Rating</h1>
                    {/* <h1 className="relative text-6xl font-bold mb-3">{overallRating}</h1> */}
                    <div className="relative inline-flex items-center justify-center mb-4">
                      <div className="absolute inset-0 bg-[hsl(158,64%,42%)]/10 blur-2xl rounded-full" />
                      <span className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-[hsl(158,64%,42%)] to-emerald-300 bg-clip-text text-transparent">{overallRating}</span>
                    </div>
                    <div className=" flex items-center gap-2 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={`w-6 h-6 transition-all duration-300 ${star <= overallRating
                            ? "fill-yellow-400 text-yellow-400 scale-110"
                            : "fill-gray-600 text-gray-600 "
                            }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-[hsl(0,0%,55%)]">
                      Based on <span className="text-[hsl(0,0%,98%)] font-semibold">{reviews?.length}</span> reviews
                    </p>
                    {/*  rating progress bars  */}
                    <div className="mt-4 pt-4 border-t w-full border-gray-700">
                      <div className="grid grid-cols-5 gap-1 text-xs text-[hsl(0%,0%,55%)]">
                        {[5, 4, 3, 2, 1].map((num) => (
                          <div key={num} className="flex flex-col items-center gap-1">
                            <div className="w-full h-1.5 bg-[hsl(210,1%,28%)] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[hsl(158,64%,42%)] rounded-full transition-all duration-500"
                                style={{
                                  width: `${ratingDistribution[num]}%`
                                }}
                              />
                            </div>
                            <span>{num}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )
            }
          </div>
        </div>
      </main>
    </>
  );
};

export default StationDetailsPage;
