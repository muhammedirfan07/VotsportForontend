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
import Footer from "../common/Footer"

const Landing = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const waitForReady = async () => {
      if (document.fonts?.ready) {
        try { await document.fonts.ready } catch (e) {}
      }
      await new Promise((resolve) => {
        const img = new Image()
        img.src = landingImg
        if (img.complete) return resolve()
        img.onload = resolve
        img.onerror = resolve
      })

      if (!cancelled) setIsLoading(false)
    }
    const maxWait = setTimeout(() => {
      if (!cancelled) setIsLoading(false)
    }, 15000)
    const minWait = new Promise((resolve) => setTimeout(resolve, 1200))

    Promise.all([waitForReady(), minWait]).then(() => {
      clearTimeout(maxWait)
    })

    const handleOffline = () => setIsLoading(true)
    const handleOnline = () => waitForReady()
    window.addEventListener("offline", handleOffline)
    window.addEventListener("online", handleOnline)

    return () => {
      cancelled = true
      clearTimeout(maxWait)
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
          className="relative min-h-screen overflow-hidden flex items-center"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${landingImg})` }}
          />

          <div className="relative z-20 mx-auto max-w-[1600px] w-full px-6 lg:px-10 pt-24 pb-16 grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-10">
              <div className="flex items-center gap-3 text-mono text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                EV Charging / For Everyone
              </div>

              <h1 className="mt-8 text-4xl sm:text-5xl md:text-7xl  font-semibold tracking-tight leading-[0.95]">
                Keep your <span className="text-primary text-nowrap">Electric Vehicle</span>
                <br />
                charging ready.
              </h1>

              <p className="mt-8 max-w-lg text-xs md:text-lg text-muted-foreground">
                Our residential, commercial, and fast charging stations are widely
                compatible, built on open standards, and designed to be accessible
                for everyone.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button
                  onClick={GoToHomePage}
                  className="group relative inline-flex items-center gap-2 cursor-pointer overflow-hidden rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 active:scale-[0.98]"
                >
                  <span className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-500 ease-out group-hover:translate-x-full" />

                  <span className="relative z-10 flex items-center gap-2">
                    {!tokenChecking ? (
                      <>
                        <MapPin
                          size={16}
                          strokeWidth={1.75}
                          className="transition-transform duration-300 group-hover:-translate-y-0.5"
                        />
                        Find Stations
                      </>
                    ) : (
                      <>
                        <Search size={16} strokeWidth={1.75} />
                        Search Now
                      </>
                    )}
                  </span>
                </button>
              </div>

              <div className="mt-16 flex items-center gap-6 text-mono text-muted-foreground">
                <span>Est. 2026</span>
                <span className="h-px w-10 bg-zinc-soft" />
                <span>Every business · Every vehicle</span>
              </div>
            </div>
          </div>
        </section>
        <AboutSection />
        <FeaturesSection />
        <FAQSection />
      </motion.main >
      <Footer />
    </>
  )
}

export default Landing