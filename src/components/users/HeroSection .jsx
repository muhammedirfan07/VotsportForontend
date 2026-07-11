import React from 'react'
import { useNavigate } from 'react-router-dom'
import landingImg from "../../assets/bgImg2.jpg"

const HeroSection = () => {
  const navigate = useNavigate()
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
    <section
      id="home"
      className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-end md:items-center justify-start px-6 sm:px-10 pb-16 pt-32 md:pt-0"
      style={{ backgroundImage: `url(${landingImg})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      <div className="relative text-foreground max-w-xl md:max-w-3xl">
        <div className="max-w-md">
          <p className="font-display text-primary font-bold text-xs sm:text-sm md:text-base mb-2">
            For Every One, Every Business, Every Electric Vehicle
          </p>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl md:text-6xl font-bold leading-[1.15] md:leading-tight mb-6 md:mb-8">
          Keep Your <span className="text-primary">Electric Vehicle</span> Charging
          Ready for Every Adventure
        </h1>

        <div className="max-w-lg">
          <p className="font-display text-sm md:text-base text-muted-foreground mt-4 md:mt-6 mb-6 leading-relaxed">
            Our residential, commercial, and fast charging stations are widely compatible, built on open
            standards, and designed to be accessible for everyone.
          </p>
        </div>

        <button
          onClick={GoToHomePage}
          className="font-display px-6 py-3 min-w-[150px] bg-primary text-primary-foreground rounded-md hover:opacity-90 transition mb-2"
        >
          {!tokenChecking ? "Search Now" : "Explore Now"}
        </button>
      </div>
    </section>
  )
}

export default HeroSection