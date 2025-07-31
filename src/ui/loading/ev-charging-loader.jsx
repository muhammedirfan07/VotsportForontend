"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Zap } from "lucide-react" // Importing the Zap icon for charging

const loadingMessages = [
  "Connecting to charging station...",
  "Authenticating vehicle...",
  "Initiating charge...",
  "Charging your EV...",
  "Optimizing power flow...",
  "Almost fully charged...",
  "Finalizing charge...",
]

export default function EVChargingLoader() {
  const [messageIndex, setMessageIndex] = useState(0) // State to manage the current message index [^1]

  useEffect(() => {
    // Set up an interval to cycle through loading messages
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length)
    }, 3000) // Change message every 3 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval)
  }, []) // Empty dependency array ensures this effect runs once on mount

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <motion.div
        className="relative w-32 h-32 md:w-48 md:h-48 rounded-full flex items-center justify-center"
        initial={{ scale: 0 }} // Initial scale for the main container
        animate={{ scale: 1 }} // Animate to full scale
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }} // Spring animation for initial appearance
      >
        {/* Outer pulsating glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-green-500 opacity-30"
          animate={{ scale: [1, 1.2, 1] }} // Pulsating scale animation
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }} // Infinite repeat with ease-in-out
        />
        {/* Inner circle with charging icon */}
        <div className="relative w-24 h-24 md:w-36 md:h-36 rounded-full bg-gray-800 flex items-center justify-center border-2 border-green-500">
          <Zap className="w-16 h-16 md:w-24 md:h-24 text-green-500" /> {/* Lucide Zap icon */}
        </div>
      </motion.div>

      {/* Dynamic loading message */}
      <motion.p
        key={messageIndex} // Key prop to trigger re-animation when the message changes
        initial={{ opacity: 0, y: 20 }} // Initial state for message animation
        animate={{ opacity: 1, y: 0 }} // Animate to visible state
        transition={{ duration: 0.5 }} // Transition duration for message
        className="mt-8 text-lg md:text-xl font-medium text-gray-300 text-center"
      >
        {loadingMessages[messageIndex]}
      </motion.p>
    </div>
  )
}
