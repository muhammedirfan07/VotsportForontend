
import { Routes, Route } from "react-router-dom"
import "./App.css"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// User Components
import Landing from "./components/users/Landing"
import Home from "./components/users/Home"
import Auth from "./components/users/Authendication"
import Profile from "./components/users/profile/Profile"
import ForgotPassword from "./pages/users/ForgotPassword"
import ResetPassword from "./pages/users/ResentPassword"
import About from "./components/users/About"
import Contact from "./components/users/profile/Contact"
///payments 
import CheckoutForms from "./pages/users/CheckoutForms"
import PaymentSuccessPage from "./pages/users/PaymentSuccessPage"

// Admin Components
import AdminDashboard from "./components/admin/AdminDashboard"
import AllPatnersViewPage from "./pages/admin/ViewAllPatterns/AllPatnersViewPage"
import AllUserViewPage from "./pages/admin/ViewAllUsers/AllUserViewPage"
import ViewAllStationList from "./pages/admin/AllStionList/ViewAllStationList"

// Collaboration & Pages
import StationDetailsPage from "./pages/users/StationDetailsPage"
import Authen from "./components/collaboration/authenticationPatners/Authent"
import ProjectManagementApp from "./components/collaboration/CHome"
import StationHome from "./components/collaboration/StationHome"
import OTPInput from "./components/collaboration/authenticationPatners/optBox"
import Notification from "./pages/collaboration/Notification"
import PartnerProfile from "./pages/collaboration/PartnerProfile"
// Common Components
import Footer from "./components/common/Footer"
import EVChargingLoader from "./ui/loading/ev-charging-loader"
import { useState, useEffect } from "react"
import AboutSection from "./components/users/AboutSection"



function App() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API/auth check or startup delay
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <EVChargingLoader />; // Show loader ONLY during loading
  }
  return (
    <>

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />


        {/* Authentication Routes */}
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth insideRegister={true} />} />
        <Route path="/logPatners" element={<Authen />} />
        <Route path="/regPatners" element={<Authen InsideTheRegister={true} />} />

        {/*  Admin Routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/allPaterns" element={<AllPatnersViewPage />} />
        <Route path="/allUsers" element={<AllUserViewPage />} />
        <Route path="/EVstations" element={<ViewAllStationList />} />

        {/*  user Routes */}
        <Route path="/:stationId/view" element={<StationDetailsPage />} />
        <Route path="/stripe-checkout/:sessionId" element={<CheckoutForms />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/resent-password/:token" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Collaboration Pages */}
        <Route path="/homecolab" element={<ProjectManagementApp />} />
        <Route path="/patnerDashboard" element={<StationHome />} />
        <Route path="/optVerifyPage" element={<OTPInput />} />
        <Route path="/notifation" element={<Notification />} />
        <Route path="/PartnerProfile" element={<PartnerProfile />} />

      </Routes>
      {/* Footer */}
      <Footer />

      {/* Add ToastContainer here */}
      <ToastContainer position="top-center" className="" autoClose={3000} />
    </>
  );
}

export default App;
