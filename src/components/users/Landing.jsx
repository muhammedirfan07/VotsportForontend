"use client"
import { useState, useEffect } from "react"
import landingImg from "../../assets/bgImg1.jpg"
import { motion, AnimatePresence } from "framer-motion"
import Header from "./Header"
import { useNavigate } from "react-router-dom"
import EVChargingLoader from "../../ui/loading/ev-charging-loader"
import AboutSection from "./AboutSection"
import FAQSection from "./FAQSection"
import FeaturesSection from "./FeaturesSection"
import { MapPin, Search } from "lucide-react"

const Landing = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stopLoading = () => {
      setTimeout(() => setIsLoading(false), 3000)
    }
    if (navigator.onLine) {
      stopLoading()
    } else {
      setIsLoading(true)
    }
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
        className="min-h-screen bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.8 }}
      >
        <Header />
        <section
          id="home"
          className="relative h-screen bg-cover bg-left bg-no-repeat flex pt-30 ps-10 items-start md:items-center md:pt-0 justify-start px-6"
          style={{ backgroundImage: `url(${landingImg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
          <div className="relative text-foreground max-w-3xl">
            <div className="max-w-md">
              <p className="font-display text-primary font-bold text-md md:text-xm mb-2">
                For Every One<span className="text-primary/70 px-1">-</span>Every Business<span className="text-primary/70 px-1">-</span>Every Eclectic Vechile
              </p>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight mb-8">
              Keep Your <span className="text-primary">Electric Vehicle</span> <br />
              Charging Ready for <br />
              Every Adventure
            </h1>
            <div className="max-w-lg">
              <p className="font-display mt-10 text-sm md:text-md text-muted-foreground md:mt-4 mb-6">
                Our residential, commercial, and fast charging stations are widely compatible, built on open
                standards, and designed to be accessible for everyone.
              </p>
            </div>
            <button
              onClick={GoToHomePage}
              className="font-display px-6 py-4 bg-primary text-primary-foreground rounded-2xl transition duration-300 group cursor-pointer hover:opacity-90"
            >
              {!tokenChecking ? (
                <span className="flex items-center gap-1">
                  <MapPin className="h-5 w-5 transition duration-300 delay-150 group-hover:-translate-y-1 group-hover:scale-110 ease-in-out" />
                  Find Stations
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Now
                </span>
              )}
            </button>
          </div>
        </section>
        <AboutSection />
        <FeaturesSection />
        <FAQSection />
      </motion.main>
    </>
  )
}

export default Landing