import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import stationHero from "../../assets/evVideo.mp4";
import networkMap from "../../assets/bgImg1.jpg";
import SubNavbar from "./SubNavbar";
import { Network, ArrowRight, ArrowUpRight } from "lucide-react";
import Footer from '../common/Footer'

function Networks() {
  const navigate = useNavigate()
  const tokenChecked = sessionStorage.getItem('PartnerToken')
  useEffect(() => {
    document.title = "VoltSpot — Charging, made effortless.";
  }, []);


  const verifactionHandile = () => {
    console.log("tokenChecked");

    if (!tokenChecked) {
      return navigate('/logPatners')
    } else {
      return navigate('/patnerDashboard')
    }

  }

  return (
    <>
      <SubNavbar />
      {/* HERO */}
      <section id="network" className="relative min-h-[92vh] overflow-hidden">

        <div className="absolute inset-0 grid-lines " />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-background" />
        <div className="absolute inset-0 grid-lines pointer-events-none" />
        <div className="relative mx-auto max-w-[1600px] px-6 lg:px-10 pt-30 pb-24 grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 text-mono text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Network / 2026
            </div>
            <h1 className="mt-8 text-6xl md:text-8xl font-semibold tracking-tight leading-[0.95]">
              Charging,
              <br />
              made <span className="text-primary">effortless.</span>
            </h1>
            <p className="mt-8 max-w-lg text-lg text-muted-foreground">
              VoltSpot connects EV drivers with real-time charging slots and
              gives partners full control over pricing, availability and payouts.
              Minimal friction. Reliable booking. Zero waiting around.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/about"
                className="group relative inline-flex items-center gap-1.5 cursor-pointer overflow-hidden rounded-full border border-border px-6 py-3 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <span className="absolute inset-0 bg-primary transition-transform duration-300 ease-out group-hover:translate-x-full" />
                <span className="relative z-10 flex items-center gap-1.5 transition-colors duration-300 group-hover:text-primary">
                  Explore the network
                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.75}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </Link>

              {!tokenChecked ? (
                <button
                  onClick={verifactionHandile}
                  className="group inline-flex items-center gap-1.5 cursor-pointer rounded-full border border-border px-6 py-3 text-sm hover:border-primary hover:text-primary transition-colors"
                >
                  Become a partner
  
                </button>
              ) : (
                <button
                  onClick={verifactionHandile}
                  className="group inline-flex items-center gap-1.5 cursor-pointer rounded-full border border-border px-6 py-3 text-sm hover:border-primary hover:text-primary transition-colors"
                >
                  Let's Go
                  <ArrowRight
                    size={16}
                    strokeWidth={1.75}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              )}
            </div>

            <div className="mt-16 flex items-center gap-6 text-mono text-muted-foreground">
              <span>Est. 2024</span>
              <span className="h-px w-10 bg-zinc-soft" />
              <span>Kannur · Kochi · Bengaluru</span>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
              <video
                src={stationHero}
                alt="VoltSpot charging station at dusk"
                width={1024}
                height={1024}
                className="w-full h-[560px] object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-mono text-foreground/90">
                <span>Station V3 · 350 kW</span>
                <span className="text-primary">● Live</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS STRIP */}
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { k: "860", l: "Stations live" },
            { k: "22", l: "Cities served" },
            { k: "99.6%", l: "Uptime SLA" },
            { k: "240 kW", l: "Peak per stall" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-4xl md:text-5xl font-semibold tracking-tight">{s.k}</div>
              <div className="mt-2 text-mono text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* NETWORK IMAGE */}
      <section className="mx-auto max-w-[1600px] px-6 lg:px-10 py-24">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <div className="text-mono text-primary">Coverage</div>
            <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
              One network. <span className="text-muted-foreground">Every city.</span>
            </h2>
            <p className="mt-6 text-muted-foreground max-w-md">
              VoltSpot stations sit along highways, in city cores and behind
              partner properties. Booking works everywhere — one app,
              one wallet, one confirmation.
            </p>
          </div>
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-border">
            <img
              src={networkMap}
              alt="VoltSpot network night view"
              width={1024}
              height={1024}
              loading="lazy"
              className="w-full h-[520px] object-cover"
            />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
export default Networks