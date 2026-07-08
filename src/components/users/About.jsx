import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, MapPin, Users, Clock } from 'lucide-react';

const stats = [
  { icon: Clock, label: "Years Running", value: "3+" },
  { icon: Zap, label: "Charging Stations", value: "150+" },
  { icon: MapPin, label: "Cities Covered", value: "20+" },
  { icon: Users, label: "Happy EV Owners", value: "5,000+" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-16">
      {/* Hero with image */}
      <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1600&q=80"
          alt="EV charging station"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-transparent to-transparent" />

        <div className="relative z-10 h-full container mx-auto px-4 flex flex-col justify-end pb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-zinc-300 hover:text-emerald-500 transition-colors mb-6 w-fit"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 max-w-2xl">
            Powering Every <span className="text-emerald-500">Journey</span>
          </h1>
          <p className="text-zinc-300 max-w-xl leading-relaxed">
            VoltSpot connects EV drivers with reliable, verified charging
            stations across the country — fast, transparent, and always on.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-20">
        {/* Floating stats card */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-2xl shadow-black/40">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center text-center">
              <Icon className="text-emerald-500 mb-2" size={26} />
              <span className="text-2xl font-bold">{value}</span>
              <span className="text-zinc-400 text-xs mt-1">{label}</span>
            </div>
          ))}
        </div>

        {/* Mission bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-20">
          <div>
            <span className="text-emerald-500 text-sm font-semibold tracking-wide uppercase">
              Our Story
            </span>
            <h2 className="text-3xl font-bold mt-2 mb-4">
              Built by drivers, for drivers
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              We partner with station owners across the country to bring
              transparent pricing, real-time slot booking, and verified
              charging locations to every EV driver — no more guessing which
              station actually works.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Every partner on our platform goes through a verification
              process, so you can book with confidence knowing the station is
              real, active, and ready when you arrive.
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1647500650273-59ee1e3235bd?w=1200&q=80"
              alt="Driver using VoltSpot"
              className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
          </div>
        </div>

        {/* Why us bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-20">
          {[
            { title: "Verified Partners", desc: "Every station is checked before it goes live." },
            { title: "Real-Time Booking", desc: "See slot availability instantly, no guesswork." },
            { title: "24/7 Support", desc: "Drivers and partners get help whenever they need it." },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-emerald-700 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-700/20 flex items-center justify-center mb-4">
                <Zap className="text-emerald-500" size={20} />
              </div>
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-zinc-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;