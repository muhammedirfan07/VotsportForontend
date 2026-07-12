import React from 'react'
import { WorldMapDemo } from "../common/WorldMapDemo"
import { Plug, Wallet, Radio, Car } from "lucide-react"

const features = [
  {
    icon: Plug,
    title: "Large-Scale Charging Network",
    text: "Eliminate range anxiety by gaining access to an expansive network of over 1.5k charging stations, strategically positioned wherever your travels take you.",
  },
  {
    icon: Wallet,
    title: "Effortless Transactions",
    text: "Seamless EV charging bookings with instant payments and real-time availability. Fast, secure, no queues.",
  },
  {
    icon: Radio,
    title: "Universal Compatibility",
    text: "Groundbreaking tech ensures hassle-free charging for every EV — say goodbye to compatibility concerns.",
  },
  {
    icon: Car,
    title: "Versatile Charging Solutions",
    text: "Full range of deployment configs — single, dual-port, e-bike and fast dual-port built for every audience.",
  },
]

const FeaturesSection = () => {
  return (
    <section id="features" className="bg-background text-foreground px-6 py-10 md:px-12">
      <div className="mb-10">
        <p className="text-primary font-display text-xs md:text-sm font-semibold tracking-widest uppercase mb-3">
          — Features
        </p>
        <h1 className="font-heading text-3xl md:text-4xl font-bold max-w-2xl leading-tight">
          Everything you need to keep moving.
        </h1>
      </div>

      <div className="p-3">
        <WorldMapDemo />
      </div>

      <div className="mx-auto px-0 py-8">
        <div className="grid grid-cols-1 font-display sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-6 transition-[transform,box-shadow] duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-primary" strokeWidth={2} />
                </div>
                <h1 className="font-heading text-xl font-bold mb-3 text-foreground">
                  {f.title}
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {f.text}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection