import React from 'react'
import chargingImg1 from "../../assets/cola.jpg"
import chargingImg2 from "../../assets/charging.jpg"
import { motion } from "framer-motion"


function AboutSection() {
  return (
    <section id="about" className="relative bg-background text-foreground overflow-hidden">
      {/* Grid + glow background */}
      <div className="absolute inset-0 grid-lines pointer-events-none" />

      {/* Content layer */}
      <div className="relative z-10 px-6 py-10 md:px-12 md:py-8">
        {/* users, company, banners */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 md:mb-14 items-center font-display">
          {[
            { number: "1,500+", label: "Charging Stations" },
            { number: "200,000+", label: "Vehicles Charged" },
            { number: "100,000+", label: "Happy Customers" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="p-2 rounded-2xl text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="px-3 py-6 bg-card/80 backdrop-blur-sm border border-border text-center hover:bg-muted transition-[transform,background-color] duration-300 hover:-translate-y-1 hover:scale-105 ease-in-out rounded-2xl">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading">{stat.number}</h1>
                <p className="text-muted-foreground text-sm md:text-md leading-7 mt-1">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* about us heading */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1 md:px-3 items-center mb-12 md:mb-14">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl leading-snug md:leading-[1.15] max-w-xl">
              A Convenient Solution For Smart Electric Car Charging
            </h1>
          </div>
          <div>
            <p className="text-muted-foreground text-sm md:text-md leading-relaxed md:leading-7">
              For more than a decade, we've been building the fueling network of the future. We have delivered more
              places to charge than anyone else, and people count on us for charging all day.
            </p>
          </div>
        </div>

        {/* charging images and descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 px-1 md:px-5 items-center mb-10 md:mb-20">
          <div className="h-56 sm:h-72 md:h-100 rounded-2xl overflow-hidden shadow-lg order-1">
            <img
              className="object-cover h-full w-full rounded-2xl transition-transform duration-300 hover:scale-105"
              src={chargingImg1 || "/placeholder.svg"}
              alt="Charging Station"
            />
          </div>
          <div className="py-2 md:py-6 rounded-2xl order-2">
            <h1 className="font-heading text-xl sm:text-2xl md:text-4xl leading-snug md:leading-[1.15] max-w-lg mb-4 md:mb-8">
              Enhancing Battery Life with Smart Charging
            </h1>
            <p className="text-muted-foreground text-sm md:text-md leading-relaxed md:leading-8">
              With smart charging, you don't need to worry about unplugging your device to keep it from staying
              charged to 100% for longer periods of time. Smart charging handles this for you, setting the battery
              level to a range that's better for long-term battery health.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 px-1 md:px-5 items-center mb-10 md:mb-20">
          <div className="py-2 px-1 md:px-3 md:py-6 rounded-2xl order-2 md:order-1">
            <h1 className="font-heading text-xl sm:text-2xl md:text-4xl leading-snug md:leading-[1.15] max-w-xl mb-4 md:mb-8">
              A Comprehensive Guide to EV Charger Types and Power Levels
            </h1>
            <p className="text-muted-foreground mb-4 text-sm md:text-md leading-relaxed md:leading-8">
              EV chargers come in different types and power levels to meet various charging demands. Their main
              functions include providing the electrical interface for energy transfer, controlling and monitoring
              the charging process, and implementing safety features. The most common types of EV chargers are Level
              1, Level 2, and DC fast chargers.
            </p>
          </div>
          <div className="h-56 sm:h-72 md:h-100 rounded-2xl overflow-hidden shadow-lg order-1 md:order-2">
            <img
              className="object-cover h-full w-full rounded-2xl transition-transform duration-300 hover:scale-105"
              src={chargingImg2 || "/placeholder.svg"}
              alt="Charging Station"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection