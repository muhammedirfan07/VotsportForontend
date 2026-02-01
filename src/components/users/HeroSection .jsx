import React from 'react'
import landingImg from "../../assets/bgImg2.jpg"

const HeroSection  = () => {
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
                style={{ width: "150px" }}
                className="font-[DM_Sans] px-4 py-2 bg-gradient-to-r from-green-600 to-gray-900 text-white rounded-md hover:from-gray-900 hover:to-green-500 mb-6"
              >
                {!tokenChecking?"Search Now":"Explore Now"}
              </button>
            </div>
          </section>
  )
}

export default HeroSection 