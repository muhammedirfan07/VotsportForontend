import { useEffect } from "react";
import { Link } from "react-router-dom";
import stationHero from "../../assets/charging.jpg";
import stationDetail from "../../assets/charging.jpg"
import SubNavbar from "./SubNavbar";
import Footer from "../common/Footer";

const RAIL = [
  { id: "intro", label: "Intro" },
  { id: "mission", label: "Mission" },
  { id: "customers", label: "Customers" },
  { id: "chargers", label: "Chargers" },
  { id: "team", label: "Team" },
];

 function About() {
  useEffect(() => {
    document.title = "About — VoltSpot EV Charging";
  }, []);

  return (
    <div className="relative">
       <SubNavbar/>
      {/* INTRO */}
      <section
        id="intro"
        className="relative min-h-[90vh] overflow-hidden flex items-end"
      >
          <div className="absolute inset-0 grid-lines pointer-events-none" />

        <div className="absolute inset-0 grid-lines opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        <div className="relative mx-auto max-w-[1600px] px-6 lg:px-10 pt-30 py-24 grid lg:grid-cols-12 gap-10 w-full">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 text-mono text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              About / 2026
            </div>
            <h1 className="mt-8 text-6xl md:text-8xl font-semibold tracking-tight leading-[0.95]">
              Charging,
              <br />
              made <span className="text-primary">effortless.</span>
            </h1>
            <p className="mt-8 max-w-lg text-lg text-muted-foreground">
              VoltSpot connects EV drivers with real-time charging slots and
              gives partners full control over pricing, availability, and payouts.
              Minimal friction. Reliable booking. Zero waiting around.
            </p>
            <div className="mt-12 flex items-center gap-6 text-mono text-muted-foreground">
              <span>Est. 2024</span>
              <span className="h-px w-10 bg-zinc-soft" />
              <span>Kannur · Kochi · Bengaluru</span>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl border border-border">
              <img
                src={stationHero}
                alt="VoltSpot charging station"
                width={1024}
                height={1024}
                className="w-full h-[560px] object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-mono">
                <span>Station V3 · 350 kW</span>
                <span className="text-primary">● Live</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section id="mission" className="border-t border-border">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-28 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 text-mono text-muted-foreground">
            <div className="flex items-center gap-3 text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Mission / 01
            </div>
            <p className="mt-6 max-w-xs">
              Why we exist and the shape of the problem we chose to solve.
            </p>
          </div>
          <div className="lg:col-span-8">
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
              Get a driver to a charger —
              <span className="text-muted-foreground"> without asking them to think about it.</span>
            </h2>
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {[
                {
                  k: "Reliable",
                  v: "Every slot tracked in real time. If a charger goes offline, the partner is notified before the next booking lands.",
                },
                {
                  k: "Open",
                  v: "One wallet, one app, one invoice — across every partner station on the network.",
                },
                {
                  k: "Quiet",
                  v: "No queues at the plug. Book ahead, walk up, charge. The app does the waiting for you.",
                },
              ].map((c) => (
                <div
                  key={c.k}
                  className="rounded-2xl border border-border bg-card p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="text-mono text-primary">{c.k}</div>
                  <p className="mt-4 text-foreground/90">{c.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMERS */}
      <section id="customers" className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-28 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 text-mono text-muted-foreground">
            <div className="flex items-center gap-3 text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Customers / 02
            </div>
            <p className="mt-6 max-w-xs">
              Who plugs into VoltSpot — from weekend drivers to network partners.
            </p>
          </div>
          <div className="lg:col-span-8">
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
              Drivers, partners, cities.
            </h2>

            <div className="mt-12 divide-y divide-border border-y border-border">
              {[
                {
                  n: "01",
                  k: "Drivers",
                  v: "Home, highway, weekend trip. Book a slot with any card, no wallet top-up required.",
                  m: "12k+ active",
                },
                {
                  n: "02",
                  k: "Partners",
                  v: "List a station, set your own pricing, get payouts on a schedule. Dashboard included.",
                  m: "60+ partners",
                },
                {
                  n: "03",
                  k: "Cities",
                  v: "Kerbside and public stations with real-time occupancy data for planners.",
                  m: "6 cities",
                },
                {
                  n: "04",
                  k: "Retail & hospitality",
                  v: "Turnkey install at hotels, malls and destinations. Revenue share, no capex.",
                  m: "40+ sites",
                },
              ].map((r) => (
                <div
                  key={r.k}
                  className="group grid grid-cols-12 items-baseline gap-6 py-8 hover:bg-secondary/40 transition-colors px-2"
                >
                  <div className="col-span-2 md:col-span-1 text-mono text-muted-foreground">
                    {r.n}
                  </div>
                  <div className="col-span-10 md:col-span-3 text-2xl md:text-3xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                    {r.k}
                  </div>
                  <div className="col-span-12 md:col-span-6 text-muted-foreground">
                    {r.v}
                  </div>
                  <div className="col-span-12 md:col-span-2 text-mono text-primary md:text-right">
                    {r.m}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CHARGERS */}
      <section id="chargers" className="border-t border-border">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-28 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 text-mono text-muted-foreground">
            <div className="flex items-center gap-3 text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Chargers / 03
            </div>
            <p className="mt-6 max-w-xs">
              Three hardware tiers. One booking layer built to sit on top of any of them.
            </p>
          </div>
          <div className="lg:col-span-8">
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
              Hardware, <span className="text-muted-foreground">on purpose.</span>
            </h2>

            <div className="mt-12 grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2 relative overflow-hidden rounded-2xl border border-border">
                <img
                  src={stationDetail}
                  alt="VoltSpot CCS connector"
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="w-full h-[420px] object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-mono">
                  <span>Connector · CCS2</span>
                  <span className="text-primary">● IP67</span>
                </div>
              </div>

              {[
                {
                  k: "Highway V3",
                  w: "350 kW",
                  v: "Ultra-rapid highway stall. Liquid-cooled cable, 800V native.",
                },
                {
                  k: "Kerb K1",
                  w: "22 kW AC",
                  v: "Slim kerbside pillar for cities. Screenless, tap-to-charge.",
                },
                {
                  k: "Depot D2",
                  w: "180 kW DC",
                  v: "Fleet depot charger, load-balanced overnight billing.",
                },
                {
                  k: "Home H1",
                  w: "11 kW AC",
                  v: "Residential unit for partner-hosted home charging.",
                },
              ].map((c) => (
                <div
                  key={c.k}
                  className="rounded-2xl border border-border bg-card p-6 hover:border-primary/60 hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl font-semibold">{c.k}</div>
                    <div className="text-mono text-primary">{c.w}</div>
                  </div>
                  <p className="mt-4 text-muted-foreground">{c.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-10 py-28 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 text-mono text-muted-foreground">
            <div className="flex items-center gap-3 text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Team / 04
            </div>
            <p className="mt-6 max-w-xs">
              Built solo, end to end — from booking flow to infrastructure.
            </p>
          </div>
          <div className="lg:col-span-8">
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
              One builder. <span className="text-muted-foreground">Full stack.</span>
            </h2>

            <div className="mt-12 max-w-sm">
              <div className="group rounded-2xl border border-border bg-background p-6 hover:border-primary/60 transition-colors">
                <div className="aspect-[4/5] rounded-xl bg-gradient-to-br from-secondary via-zinc to-background border border-border relative overflow-hidden">
                  <div className="absolute inset-0 grid-lines opacity-40" />
                  <div className="absolute bottom-3 left-3 text-mono text-primary">
                    Kannur, Kerala
                  </div>
                </div>
                <div className="mt-5">
                  <div className="text-lg font-semibold">Muhammed Irfan</div>
                  <div className="text-mono text-muted-foreground mt-1">
                    Founder & Full-stack Developer
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
     <Footer />
    </div>
  );
}
export default About