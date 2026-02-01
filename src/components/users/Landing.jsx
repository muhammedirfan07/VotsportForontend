"use client"
import { useState, useEffect } from "react"
import landingImg from "../../assets/bgImg2.jpg"
import { motion, AnimatePresence } from "framer-motion"
import Header from "./Header"
import { useNavigate } from "react-router-dom"
import EVChargingLoader from "../../ui/loading/ev-charging-loader"
import AboutSection from "./AboutSection"
import FAQSection from "./FAQSection"
import FeaturesSection from "./FeaturesSection"
import { MapPin,Search } from "lucide-react"
const Landing = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    // Function to stop loader after a delay
    const stopLoading = () => {
      setTimeout(() => setIsLoading(false), 3000)
    }

    // --- Initial check on page load ---
    if (navigator.onLine) {
      stopLoading()
    } else {
      setIsLoading(true)
    }

    // --- Event listeners for network status ---
    const handleOffline = () => setIsLoading(true)
    const handleOnline = () => stopLoading()

    window.addEventListener("offline", handleOffline)
    window.addEventListener("online", handleOnline)

    return () => {
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("online", handleOnline)
    }
  }, [])



  const tokenChecking = sessionStorage.getItem("token")
  const GoToHomePage = () => {
    console.log("buton clicked")
    if (!tokenChecking) {
      navigate("/login")
      return
    } else {
      navigate("/home")
      return
    }
  }

  return (
    <>
      <AnimatePresence>{isLoading && <EVChargingLoader />}</AnimatePresence>
      <motion.main
        className="min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.8 }}
      >
        <Header />
        {/*-----landing page start-----------*/}
        <section
          id="home"
          className="relative h-screen bg-cover bg-left bg-no-repeat flex pt-30 ps-10 items-start md:items-center md:pt-0 justify-start px-6"
          style={{ backgroundImage: `url(${landingImg})` }}
        >
          {/* Left-Side Gradient Overlay (40% Opacity) */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/100 to-transparent  " />
          <div className="absolute inset-0 bg-gradient-to-t from-black/100 to-transparent  " />
          {/* Content Section */}
          <div className="relative text-white max-w-3xl">
            {/* Added relative to appear above overlay */}
            <div className=" max-w-md">
              {" "}
              <p className="font-[DM_Sans] text-green-600 font-bold text-md md:text-xm mb-2 ">
                For Every One,Everey Business,Every Electic Vechile
              </p>
            </div>
            <h1 className="font-[Manrope] text-4xl md:text-6xl font-bold leading-tight mb-8 ">
              Keep Your <span className="text-green-500">Electric Vehicle</span> <br />
              Charging Ready for <br />
              Every Adventure
            </h1>
            <div className="max-w-lg">
              <p className="font-[DM_Sans] mt-10 text-sm md:text-md md:mt-4 mb-6">
                Our residential, commercial, and fast charging stations are widely compatible, built on open
                standards, and designed to be accessible for everyone.
              </p>
            </div>
            <button
              onClick={GoToHomePage}
              size="lg"
              className="font-[DM_Sans] font-medium px-8 py-4 bg-gradient-to-r from-green-600 to-gray-900 text-white rounded-md hover:from-gray-900 hover:to-green-500 mb-6"
            >
              {!tokenChecking ? <span className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Find Stations
              </span> : <span className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Now
              </span>}


            </button>
          </div>
        </section>
        {/*-----landing page end-----------*/}
        <AboutSection />
        {/*------- about page end ----------*/}
        <FeaturesSection />
        {/* ------features page end--------- */}
        <FAQSection />
        {/* -----support page end-------- */}
      </motion.main>
    </>
  )
}

export default Landing
