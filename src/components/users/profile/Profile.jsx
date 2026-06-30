import React, { useEffect, useState, useRef } from 'react';
import { User, Car, Wallet, Calendar, LogOut, Camera, Save, ArrowBigRightDash, Lock } from 'lucide-react';
import BookingHistory from '../../../pages/users/BookingHistory';
import { singleUserDetailsAPI, updateUserProfileAPI } from '../../../Server/allAPI';
import SERVER_URL from '../../../Server/serverURL';
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
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
  );
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
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
        if (result.data.profileImage) {
          setImagePreview(`${SERVER_URL}/${result.data.profileImage}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatJoinDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const formatYearOnly = (date) => {
    if (!date) return "";
    return new Date(date).getFullYear();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setSaveError("Image must be under 5MB");
      return;
    }
    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    const token = sessionStorage.getItem("token");
    const reqHeaders = { Authorization: `Bearer ${token}` };

    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("phone", formData.phone);
    if (profileImage) data.append("profileImage", profileImage);

    setLoading(true);
    setSaveError("");
    try {
      const result = await updateUserProfileAPI(data, reqHeaders);
      if (result.status === 200) {
        // Update sessionStorage with latest user data
        sessionStorage.setItem("user", JSON.stringify(result.data.user));
        setSingleUserDetails(result.data.user);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.log(error);
      setSaveError("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Top Bar */}
      <div className="flex  justify-end  px-4 pt-4 pb-0 max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-1.5 text-green-500 font-semibold hover:text-green-400 transition-all duration-300 group flex-shrink-0 ml-4"
        >
          <span className=" text-sm">Home</span>
          <ArrowBigRightDash className="h-5 w-5 transform transition-all duration-300 group-hover:translate-x-1" />
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
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
                  <img src={imagePreview} alt="Profile" className="h-full w-full object-cover" />
                </div>
                <h2 className="text-xl text-gray-200 font-semibold mt-3">
                  {singleUserDetails.fullName}
                </h2>
                <p className="text-neutral-400 text-sm mt-1">
                  Member since {formatYearOnly(singleUserDetails.createdAt)}
                </p>
              </div>

              <nav className="mt-4">
                <ul className="space-y-2">
                  {[
                    { key: 'profile', label: 'Profile Information', Icon: User },
                    { key: 'vehicles', label: 'Vehicle Details', Icon: Car },
                    { key: 'bookings', label: 'Booking History', Icon: Calendar },
                    { key: 'wallet', label: 'Payment & Wallet', Icon: Wallet },
                  ].map(({ key, label, Icon }) => (
                    <li key={key}>
                      <button
                        onClick={() => setActiveTab(key)}
                        className={`w-full flex items-center p-3 text-left cursor-pointer rounded-2xl transition-all ease-in-out ${activeTab === key
                            ? 'bg-green-500/10 border-l-4 border-green-500 pl-4 text-green-500'
                            : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                          }`}
                      >
                        <Icon size={18} className="mr-3" />
                        <span>{label}</span>
                      </button>
                    </li>
                  ))}

                  <div className="h-px bg-neutral-700 my-4"></div>

                  <button
                    onClick={() => { sessionStorage.clear(); navigate('/'); }}
                    className="w-full flex cursor-pointer items-center gap-4 px-3 py-3 rounded-2xl text-red-500 hover:bg-red-800/10 transition-all duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-base font-medium">Logout</span>
                  </button>
                </ul>
              </nav>
            </div>
          </aside>

          {/* Content Area */}
          <section className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl px-7 py-6">
                <h1 className="text-2xl text-white font-bold mb-1">Profile Information</h1>
                <p className="text-md text-neutral-400 mb-6">Update your personal details</p>

                <div className="space-y-6">
                  {/* Profile Photo Card */}
                  <div className="p-6 rounded-xl bg-neutral-800/50 border border-neutral-700 hover:border-green-500/40 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="relative flex-shrink-0">
                        <div className="h-24 w-24 rounded-full bg-green-500/20 border-2 border-green-400 overflow-hidden">
                          <img src={imagePreview} alt="Profile" className="h-full w-full object-cover" />
                        </div>
                        <button
                          onClick={() => fileInputRef.current.click()}
                          className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-green-500 text-black flex items-center justify-center hover:bg-green-400 hover:scale-110 transition-all"
                        >
                          <Camera className="h-4 w-4" />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </div>
                      <div className="text-center sm:text-left">
                        <h3 className="text-lg font-semibold text-neutral-200">Profile Photo</h3>
                        <p className="text-sm text-neutral-400 mt-1">JPG, PNG or GIF — max 5MB</p>
                        <button
                          onClick={() => fileInputRef.current.click()}
                          className="mt-3 px-4 py-1.5 text-sm rounded-lg border border-green-500/50 text-green-400 hover:bg-green-500/10 transition-all"
                        >
                          Change Photo
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-200">Full Name</label>
                      <input
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Enter your full name"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-800 text-neutral-200 border border-neutral-700 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-400/40 transition-all"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-200">Phone Number</label>
                      <input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 ..."
                        className="w-full px-3 py-2 rounded-xl bg-neutral-800 text-neutral-200 border border-neutral-700 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-400/40 transition-all"
                      />
                    </div>

                    {/* Email — LOCKED */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-200 flex items-center gap-2">
                        Email Address
                        {/* <span className="inline-flex items-center gap-1 text-xs text-neutral-500 bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded-full">
                          <Lock className="h-3 w-3" /> locked
                        </span> */}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-3 py-2 rounded-xl bg-neutral-800/50 text-neutral-500 border border-neutral-700 opacity-60 cursor-not-allowed"
                      />
                    </div>

                    {/* Member Since */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-200">Member Since</label>
                      <input
                        value={formData.memberSince}
                        disabled
                        className="w-full px-3 py-2 rounded-xl bg-neutral-800/50 text-neutral-500 border border-neutral-700 opacity-60 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end items-center gap-4 pt-4 border-t border-neutral-800">
                    {saveSuccess && (
                      <span className="text-sm text-green-400">✓ Profile saved successfully</span>
                    )}
                    {saveError && (
                      <span className="text-sm text-red-400">✗ {saveError}</span>
                    )}
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="bg-green-500 cursor-pointer hover:bg-green-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2 rounded-xl flex items-center gap-2 text-black font-medium transition-all"
                    >
                      <Save className="h-4 w-4" />
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && <BookingHistory joinData={singleUserDetails.createdAt} />}
            {activeTab === 'vehicles' && <VehicleDetails />}
            {activeTab === 'wallet' && <Payments />}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Profile;