import React from 'react'
import chargingImg1 from "../../assets/cola.jpg"
import chargingImg2 from "../../assets/charging.jpg"
import { motion  } from "framer-motion"

function AboutSection() {
  return (
    <section id="about" className="bg-black text-white px-6 py-8 md:px-12">
                {/* users, commpany, banners */}
                <div className="grid gird-cols-1 md:grid-cols-3 gap-4 mb-14  items-center font-[Dm_Sans] ">
                   {[
                  { number: "1,500+", label: "Charging Stations" },
                  { number: "200,000+", label: "Vehicles Charged" },
                  { number: "100,000+", label: "Happy Customers" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="p-6 bg-card rounded-2xl text-center hover:bg-secondary transition-colors duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
     <div className="px-3 py-4 bg-gray-950 text-center hover:bg-gray-800 transition duration-300  delay-150 hover:-translate-y-1 hover:scale-110  ease-in-out rounded-2xl">
                      <h1 className="text-3xl md:text-4xl max-w-md">{stat.number}</h1>
                      <p className="text-gray-400 text-md leading-7">{stat.label}</p>
                    </div>
                  </motion.div>
                     ))}
                   
                </div>
                {/* about us heading */}
                <div className="grid grid-cols-1 md:grid-cols-2 md:grid-flow-row-dense font-[DM_Sans]  gap-6 px-3 items-center mb-14">
                  {/* Left Side  */}
                  <div>
                    <h1 className="  text-3xl md:text-4xl/14  max-w-xl  ">
                      A Convenient Solution For Smart Electric Car Charging
                    </h1>
                  </div>
                  {/* Right Side */}
                  <div>
                    <p className="text-gray-400  text-md leading-7 ">
                      For more than a decade, we've been building the fueling network of the future. We have delivered more
                      places to charge than anyone else, and people count on us for charging all day.
                    </p>
                  </div>
                </div>
                {/* charging images and discriptions */}
                <div className="grid grid-cols-1 md:grid-cols-2 md:grid-flow-row-dense font-[DM_Sans] gap-8 px-5 items-center mb-10 md:mb-20">
                  {/* Left Side -*/}
                  <div className="h-100 rounded-2xl overflow-hidden shadow-lg">
                    <img
                      className="object-cover h-full w-full rounded-2xl transition-transform duration-300 hover:scale-105"
                      src={chargingImg1 || "/placeholder.svg"}
                      alt="Charging Station"
                    />
                  </div>
                  {/* Right Side - */}
                  <div className=" h-100 py-3 md:py-6 rounded-2xl">
                    <h1 className="  text-3xl md:text-4xl/10  max-w-lg mb-8  ">
                      Enhancing Battery Life with Smart Charging
                    </h1>
                    <p className="text-gray-400  text-md leanding-4 md:leading-8 ">
                      With Smart charging, you don't need to worry about unplugging your device to keep it from staying
                      charged to 100% for longer periods of time—Smart charging handles charging for you. If your device has
                      Smart charging turned on, the battery level will be set to a lower level that's better for the battery
                      overall. give me this note sutable best headings
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 md:grid-flow-row-dense  font-[DM_Sans] gap-8 px-5 items-center mb-8 md:mb-20">
                  <div className=" h-100  px-3 py-3 md:py-6 rounded-2xl">
                    <h1 className="  text-3xl md:text-4xl/10   max-w-xl mb-8  ">
                      A Comprehensive Guide to EV Charger Types and Power Levels
                    </h1>
                    <p className="text-gray-400  mb-4 text-md leanding-4 md:leading-8 ">
                      EV chargers come in different types and power levels to meet various charging demands. Their main
                      functions include providing the electrical interface for energy transfer, controlling and monitoring
                      the charging process, and implementing safety features. The most common types of EV chargers are Level
                      1, Level 2, and DC fast chargers.
                    </p>
                  </div>
                  <div className="h-100 rounded-2xl overflow-hidden shadow-lg">
                    <img
                      className="object-cover h-full w-full rounded-2xl transition-transform duration-300 hover:scale-105"
                      src={chargingImg2 || "/placeholder.svg"}
                      alt="Charging Station"
                    />
                  </div>
                </div>
              </section>
  )
}

export default AboutSection