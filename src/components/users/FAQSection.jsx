import React, { useState } from 'react'
import chargingImg3 from "../../assets/faq.webp"
import { ChevronDown, ChevronUp} from "lucide-react"
import { motion,AnimatePresence  } from "framer-motion"
const FAQSection = () => {
    
  const [openAccordion, setOpenAccordion] = useState("open")
  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id)
  }
     const FAQSection = () => {
  const [openAccordion, setOpenAccordion] = useState<string | null>("booking");


  };
  return (
    <section id="support" className="bg-black pt-4 text-white px-6 pb-3 md:px-12">
            {/* Heading */}
            <div className="grid grid-cols-1 md:grid-cols-2 md:grid-flow-row-dense font-[DM_Sans] gap-8 px-5 items-center mb-10">
              <div>
                <h1 className="  text-3xl md:text-4xl/14  max-w-xl  ">
                  Let's see what our Customers & Users say about us
                </h1>
              </div>
              <div>
                <p className="text-gray-400 text-md leading-7">
                  Here are some testimonials from satisfied customers who have used our EV charging stations.
                </p>
              </div>
            </div>
            {/* FAQ Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 md:grid-flow-row-dense font-[DM_Sans] gap-8 px-5 items-center mb-20">
            {/* Left Side - Image */}
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                className="object-cover h-full w-full rounded-2xl transition-transform duration-300 hover:scale-105"
                src={chargingImg3}
                alt="Charging Station"
              />
            </div>
            {/* Right Side - FAQ */}
            <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 space-y-4"
          >
            {[
                  {
                    id: "booking",
                    question: "How do I book a charging station?",
                    answer: "You can book a charging station through our mobile app or website. Simply select your location, choose an available slot, and confirm your booking."
                  },
                  {
                    id: "benefits",
                    question: "Why should I opt for a charging station?",
                    answer: "Charging stations offer faster, safer, and more convenient charging for your electric vehicle. They provide higher power output than standard outlets, reducing charging time significantly."
                  },
                  {
                    id: "availability",
                    question: "How can I check the availability of charging stations?",
                    answer: "You can check the availability of charging stations through our mobile app or website. Simply enter your location to view nearby stations."
                  },
                  {
                    id: "payment",
                    question: "What payment methods are supported?",
                    answer: "We support various payment methods, including credit/debit cards, mobile wallets, and UPI payments. You can also set up automatic payments for a seamless experience."
                  },
                  {
                    id: "cancellation",
                    question: "What is the cancellation policy for bookings?",
                    answer: "You can cancel your booking up to 1 hour before your scheduled time for a full refund. Cancellation features are being enhanced continuously."
                  }
                ].map((faq) => (
               <div
                key={faq.id}
                className="border border-neutral-700 rounded-xl overflow-hidden bg-card"
              >
                <button
                  className="w-full flex justify-between items-center p-5 text-left font-heading font-semibold text-foreground hover:text-emerald-700 transition-colors duration-200"
                  onClick={() => toggleAccordion(faq.id)}
                >
                  <span>{faq.question}</span>
                  {openAccordion === faq.id ? (
                    <ChevronUp className="flex-shrink-0 h-5 w-5 text-primary" />
                  ) : (
                    <ChevronDown className="flex-shrink-0 h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                <AnimatePresence>
                  {openAccordion === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
          </div>
          </section>
  )
}

export default FAQSection