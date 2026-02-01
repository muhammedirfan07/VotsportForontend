"use client"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Zap } from "lucide-react" // Importing the Zap icon for charging

/**
 * @typedef {object} EVChargingLoaderProps
 */

const loadingMessages = [
  "Connecting to charging station...",
  "Authenticating vehicle...",
  "Initiating charge...",
  "Charging your EV...",
  "Optimizing power flow...",
  "Almost fully charged...",
  "Finalizing charge...",
]

/**EVChargingLoader component displays a dynamic EV charging animation with cycling messages.
 * @param {EVChargingLoaderProps} props
 */
export default function EVChargingLoader() {
  const [messageIndex, setMessageIndex] = useState(0) 

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length)
    }, 3000) 

   
    return () => {
      clearInterval(messageInterval)
    }
  }, []) 

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-[9999]">
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
        <motion.div
          className="relative w-32 h-32 md:w-48 md:h-48 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }} 
        >
          {/* Outer pulsating glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-green-500 opacity-30"
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }} 
          />
          {/* Inner circle with charging icon */}
          <div className="relative w-24 h-24 md:w-36 md:h-36 rounded-full bg-gray-800 flex items-center justify-center border-2 border-green-500">
            <Zap className="w-16 h-16 md:w-24 md:h-24 text-green-500" /> {/* Lucide Zap icon */}
          </div>
        </motion.div>
        {/* Dynamic loading message */}
        <motion.p
          key={messageIndex} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          className="mt-8 text-lg md:text-xl font-medium text-gray-300 text-center"
        >
          {loadingMessages[messageIndex]}
        </motion.p>
      </div>
    </div>
  )
}
