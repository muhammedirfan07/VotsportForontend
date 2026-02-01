import React, { useEffect, useState } from 'react';
import { User, Car, Wallet, Calendar, LogOut, Camera, Save, ArrowBigRightDash } from 'lucide-react';
import BookingHistory from '../../../pages/users/BookingHistory';
import { singleUserDetailsAPI } from '../../../Server/allAPI';
import PaymentHistory from '../../../pages/users/PaymentHistory';
import { useNavigate } from 'react-router-dom';
import VehicleDetails from '../../../pages/users/Vechle -details/VechileDetails';
import Payments from '../../../pages/users/Wallet/Paymets';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [singleUserDetails, setSingleUserDetails] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    memberSince: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    getViewUserDetails();
  }, []);

  const getViewUserDetails = async () => {
    const userData = sessionStorage.getItem("user");
    const authUser = JSON.parse(userData);
    const userId = authUser?._id;
    const token = sessionStorage.getItem("token");

    if (!token) return;

    const reqHeaders = { Authorization: `Bearer ${token}` };

    try {
      const result = await singleUserDetailsAPI(userId, reqHeaders);
      if (result.status === 200) {
        setSingleUserDetails(result.data);

        setFormData({
          fullName: result.data.fullName,
          email: result.data.email,
          phone: result.data.phone || "",
          memberSince: formatJoinDate(result.data.createdAt)
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatJoinDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatYearOnly = (date) => {
    return new Date(date).getFullYear();
  };

  const handleSave = () => {
    console.log("Updated User:", formData);
    // Submit logic here
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="flex justify-end p-3">
        <button
         onClick={()=>{navigate('/home')}}
          className="flex items-center gap-2 text-green-500 font-semibold
               hover:text-green-400 transition-all duration-300 
               group"
        >
          Home
          <ArrowBigRightDash
            className="h-5 w-5 transform transition-all duration-300 group-hover:translate-x-1"
          />
        </button>
      </div>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-4 lg:px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <p className="text-neutral-500 text-md mt-2">Manage your account and EV charging preferences</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-neutral-900 border border-neutral-800 shadow w-full rounded-2xl p-6 sticky top-8">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="h-24 w-24 rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center overflow-hidden">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h2 className="text-xl text-gray-200 font-semibold">{singleUserDetails.fullName}</h2>
                <p className="text-neutral-400 text-sm mt-1">
                  Member since {formatYearOnly(singleUserDetails.createdAt)}
                </p>
              </div>

              {/* Navigation */}
              <nav className="mt-8">
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`w-full flex items-center p-3 text-left cursor-pointer rounded-2xl ${activeTab === 'profile'
                        ? 'bg-green-500/10 border-l-4 border-green-500 pl-4 text-green-500'
                        : "text-neutral-400 hover:text-white transition-all ease-in-out hover:bg-neutral-800 "
                        }`}
                    >
                      <User size={18} className="mr-3" />
                      <span>Profile Information</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('vehicles')}
                      className={`w-full flex items-center p-3 cursor-pointer text-left rounded-2xl ${activeTab === 'vehicles'
                        ? 'bg-green-500/10 border-l-4 border-green-500 pl-4 text-green-500 '
                        : 'text-neutral-400 hover:bg-neutral-800  hover:text-white transition-all ease-in-out'
                        }`}
                    >
                      <Car size={18} className="mr-3" />
                      <span>Vechle Details</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className={`w-full flex items-center p-3 cursor-pointer text-left rounded-2xl ${activeTab === 'bookings'
                        ? 'bg-green-500/10 border-l-4 border-green-500 pl-4 text-green-500 '
                        : 'text-neutral-400 hover:text-white transition-all ease-in-out hover:bg-neutral-800'
                        }`}
                    >
                      <Calendar size={18} className="mr-3" />
                      <span>Booking History</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('wallet')}
                      className={`w-full flex items-center p-3 cursor-pointer text-left rounded-2xl ${activeTab === 'wallet'
                        ? 'bg-green-500/10 border-l-4 border-green-500 pl-4 text-green-500 '
                        : 'text-neutral-400 hover:text-white transition-all ease-in-out hover:bg-neutral-800'
                        }`}
                    >
                      <Wallet size={18} className="mr-3" />
                      <span>Payment & wallet</span>
                    </button>
                  </li>
                  <div className="h-px bg-neutral-700 my-6"></div>
                  <button onClick={() => { sessionStorage.clear(); navigate('/') }} className="w-full flex cursor-pointer items-center gap-4 px-3 py-3 rounded-2xl text-red-500 hover:bg-red-800/10 transition-all duration-200">
                    <LogOut className="w-5 h-5" />
                    <span className="text-base font-medium">Logout</span>
                  </button>
                </ul>
              </nav>
            </div>
          </aside>

          {/* Content Area */}
          <section className="lg:col-span-3">
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-neutral-900 border border-neutral-800 drop-shadow-xl rounded-2xl px-7 py-6">

                <h1 className="text-2xl text-white font-bold mb-1">Profile Information</h1>
                <h2 className=' text-md text-neutral-400 mb-6'>Update your personal details</h2>
                <div className="space-y-6">

                  {/* Profile Photo Card */}
                  <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-700 hover:border-green-500/40 transition-all duration-300">
                    <div className="relative group w-fit mx-auto">
                      <div className="h-24 w-24 rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center overflow-hidden">
                        <img
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-green-500 text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-center mt-4">
                      <h3 className="text-lg font-semibold text-neutral-200">Profile Photo</h3>
                      <p className="text-sm text-neutral-400">
                        Upload a new photo to personalize your account
                      </p>
                    </div>
                  </div>

                  {/* Editable Form Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-200">Full Name</label>
                      <input
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className="
        w-full px-3 py-2
        rounded-xl
        bg-neutral-800 text-neutral-200
        border border-neutral-700
        focus:outline-none
        focus:border-green-500
        focus:ring-2 focus:ring-green-400/40
      "
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-200">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="
        w-full px-3 py-2
        rounded-xl
        bg-neutral-800 text-neutral-200
        border border-neutral-700
        focus:outline-none
        focus:border-green-500
        focus:ring-2 focus:ring-green-400/40
      "
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-200">Phone Number</label>
                      <input
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="
        w-full px-3 py-2
        rounded-xl
        bg-neutral-800 text-neutral-200
        border border-neutral-700
        focus:outline-none
        focus:border-green-500
        focus:ring-2 focus:ring-green-400/40
      "
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-200">Member Since</label>
                      <input
                        value={formData.memberSince}
                        disabled
                        className="
        w-full px-3 py-2
        rounded-xl
        bg-neutral-800 text-neutral-400
        border border-neutral-700
        opacity-60 cursor-not-allowed
      "
                      />
                    </div>
                  </div>
                  {/* Save Button */}
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSave}
                      className="bg-green-500 cursor-pointer hover:bg-green-600 px-4 py-2 rounded-xl flex items-center  text-black shadow-lg"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </button>
                  </div>

                </div>
              </div>
            )}
           

            {/* BOOKINGS */}
            {activeTab === 'bookings' && <BookingHistory />}

            {/* vechle  */}
            {activeTab === 'vehicles' && <VehicleDetails />}

            {/* wallet & paymet HIstory */}
            {activeTab === 'wallet' && <Payments />}

          </section>
        </div>
      </main>
    </div>
  );
};

export default Profile;
