import { Link } from "react-router-dom";
import { Zap, Twitter, Instagram, Facebook, Github } from "lucide-react";

const SOCIALS = [
  { icon: Twitter, href: "https://x.com/", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Github, href: "https://github.com/muhammedirfan07", label: "GitHub" },
];

const RESOURCES = [
  { label: "Home", to: "/" },
  { label: "Network", to: "/Networks" },
  { label: "Collaboration", to: "/homecolab" },
];

const CITIES = ["Kannur", "Kochi", "Bengaluru"];

const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-zinc-100 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* BRAND */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-md bg-emerald-600 flex items-center justify-center">
              <Zap size={16} className="text-zinc-950" fill="currentColor" />
            </span>
            <span className="text-xl font-bold tracking-wide">
              <span className="text-emerald-500">Volt</span>Spot
            </span>
          </div>
          <p className="text-zinc-400 text-sm max-w-xs">
            Powering the future of EV charging, one station at a time.
          </p>
          <div className="flex gap-4 mt-6">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-emerald-500 hover:border-emerald-600/50 transition"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* RESOURCES */}
        <div>
          <p className="text-[0.7rem] tracking-[0.15em] uppercase text-zinc-500 mb-4">
            Resources
          </p>
          <ul className="space-y-3 text-sm">
            {RESOURCES.map((r) => (
              <li key={r.label}>
                <Link to={r.to} className="text-zinc-300 hover:text-emerald-500 transition">
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <p className="text-[0.7rem] tracking-[0.15em] uppercase text-zinc-500 mb-4">
            Contact
          </p>
          <p className="text-sm text-zinc-300 leading-relaxed">
            123, Main Road, New City
            <br />
            State, Country
            <br />
            <br />
            <span className="text-zinc-500">Email </span>evstation@gmail.com
            <br />
            <span className="text-zinc-500">Phone </span>+91 12345 67890
          </p>
        </div>

        {/* CITIES */}
        <div>
          <p className="text-[0.7rem] tracking-[0.15em] uppercase text-zinc-500 mb-4">
            Cities
          </p>
          <ul className="space-y-3 text-sm text-zinc-300">
            {CITIES.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-zinc-800 px-6 md:px-10 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <span>EST. 2024</span>
          <span className="text-center">© 2026 VoltSpot EV Charging — developed by Irfan</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;