import React from 'react'
import { WorldMapDemo } from "../common/WorldMapDemo"
import img1 from "../../assets/frImg1.png"
import img2 from "../../assets/frImg2.png"
import img3 from "../../assets/frImg3.png"
import img4 from "../../assets/frImg4.png"

const FeaturesSection = () => {
  return (
   <section id="features" className="bg-black text-white px-6 py-10 md:px-12">
            {/* features heading */}
            <div className="grid grid-cols-1 md:grid-cols-2 md:grid-flow-row-dense font-[DM_Sans] gap-8 px-5 items-center mb-4">
              <div>
                <h1 className="  text-3xl md:text-4xl/14  max-w-xl  ">
                  EV Charging Solution For Every Free Drive & Features
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
            {/* world map */}
            <div className="p-3">
              <WorldMapDemo />
            </div>
            {/* features */}
            <div className=" mx-auto px-4 py-4">
              <div className="grid grid-cols-1 font-[DM_Sans] sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="overflow-hidden rounded-lg drop-shadow-lg hover:bg-gray-950 bg-gray-900 ease-in-out p-4">
                  <div className="w-23 mb-4">
                    <img src={img1 || "/placeholder.svg"} alt="no image" className="w-full object-cover " />
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl max-w-md mb-4">Large-Scale Charging Network</h1>
                    <p className="text-gray-400">
                      Eliminate range anxiety by gaining access to an expansive network of over 1.5k charging stations,
                      strategically positioned wherever your travels take you.{" "}
                    </p>
                  </div>
                </div>
                <div className="overflow-hidden rounded-lg drop-shadow-lg hover:bg-gray-950 bg-gray-900 ease-in-out p-4">
                  <div className="w-16 mb-4">
                    <img src={img2 || "/placeholder.svg"} alt="no image" className="w-full object-cover " />
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl max-w-md mb-4">Effortless Transactions expirience</h1>
                    <p className="text-gray-400 ">
                      Seamless EV charging bookings with instant payments and real-time availability. Fast, secure,Enjoy
                      instant payments,real-time availability updates, and a smooth booking process{" "}
                    </p>
                  </div>
                </div>
                <div className="overflow-hidden rounded-lg drop-shadow-lg hover:bg-gray-950 bg-gray-900 ease-in-out p-4">
                  <div className="w-22 mb-4">
                    <img src={img3 || "/placeholder.svg"} alt="no image" className="w-full object-cover " />
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl max-w-md mb-4">the Universal Compatibility</h1>
                    <p className="text-gray-400">
                      Our groundbreaking technology ensures hassle-free charging for every EV, letting you say goodbye
                      to compatibility concerns.{" "}
                    </p>
                  </div>
                </div>
                <div className="overflow-hidden rounded-lg drop-shadow-lg hover:bg-gray-950  bg-gray-900  ease-in-out p-4">
                  <div className="w-23 mb-4">
                    <img src={img4 || "/placeholder.svg"} alt="no image" className="w-full object-cover " />
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl max-w-md mb-4">Versatile Charging Solutions</h1>
                    <p className="text-gray-400">
                      We offer a full range of deployment configurations, from single to dual-port for all cars, dual
                      port with e-bike charging, and fast dual-port built for all audience{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
  )
}

export default FeaturesSection