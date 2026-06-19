import React, { useState } from 'react';
import { partnersRegisterAPI, patnersLoginAPI } from '../../../Server/allAPI';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner } from "react-icons/fa";
import { ArrowRight, Check, Eye, EyeOff, Zap,Building2 } from "lucide-react";
import loginPatnerImg from '../../../assets/loginpatnerImg.jpeg'

function Field({ id, label, type = "text", placeholder, value, onChange }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-zinc-400">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="h-12 w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-colors"
      />
    </div>
  );
}

// ── main component ─────────────────────────────────────────────────────────────
const Authen = ({ InsideTheRegister }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [patnerInput, setPatnerInput] = useState({
    StationName: "",
    email: "",
    password: "",
    address: "",
  });
   console.log("partnerInput",patnerInput);
   
  const navigate = useNavigate();

  const rules = [
    { label: "At least 8 characters", test: (p) => p.length >= 8 },
    { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
    { label: "One number", test: (p) => /\d/.test(p) },
  ];

  // ── register ──────────────────────────────────────────────────────────────
  const panterRegisterHandle = async (e) => {
    e.preventDefault();
    if (
      patnerInput.StationName &&
      patnerInput.email &&
      patnerInput.password &&
      patnerInput.address
    ) {
      try {
        setIsRegister(true);
        const result = await partnersRegisterAPI(patnerInput);
        if (result.status === 200) {
          toast.success(result.data.message, { position: "top-right", theme: "dark" });
          navigate("/optVerifyPage");
          setPatnerInput({ StationName: "", email: "", password: "", address: "" });
        } else if (result.status === 406 || result.status === 400) {
          toast.error(result.response.data.message, { position: "top-right", theme: "dark" });
        }
      } catch (err) {
        console.log("error", err);
      } finally {
        setIsRegister(false);
      }
    } else {
      toast.warning("Fill the form completely…", { position: "top-right", theme: "dark" });
    }
  };

  // ── login ─────────────────────────────────────────────────────────────────
  const PatnerLoginHandle = async (e) => {
    e.preventDefault();
    if (!patnerInput.email || !patnerInput.password) {
      toast.info("Please enter your email and password!", { position: "top-right", theme: "dark" });
      return;
    }
    setIsLoading(true);
    try {
      const result = await patnersLoginAPI(patnerInput);
      if (result.status === 200) {
        const { partner, PartnerToken } = result.data;
        sessionStorage.setItem("partner", JSON.stringify(partner));
        sessionStorage.setItem("PartnerToken", PartnerToken);
        toast.success(`Welcome! 🎉`, { position: "top-right", theme: "dark" });
        navigate("/homecolab");
        setPatnerInput({ email: "", password: "" });
      } else if (result.status === 406 || result.status === 400) {
        toast.warning(result.response.data.message, { position: "top-right", theme: "dark" });
      }
    } catch (err) {
      console.error("Login Error:", err);
      toast.error("Something went wrong! Please try again.", { position: "top-right", theme: "dark" });
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center  bg-zinc-950 text-zinc-100">

      {/* brand bar */}
      <header className="absolute hidden md:flex top-5 mb-3 left-6 z-20">
        <Link to="/">
          <h3 className=" flex text-3xl gap-1 p text-green-100 font-bold">
            <span className="flex h-10  w-10 items-center justify-center rounded-full bg-green-600 "> <i class="fa-solid fa-bolt text-xl" style={{ color: "#f0efef" }}></i> </span>
            <p> <span className="text-3xl   text-green-600 font-michroma">Volt</span>Spot</p>
          </h3>
        </Link>
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-6 sm:gap-10 sm:px-10 sm:py-12 lg:grid-cols-2 lg:gap-12 lg:px-14 lg:py-14">

        {/* ── left visual panel ── */}
        <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 sm:rounded-3xl">
        <header  className="absolute md:hidden  top-4  left-4 z-20">
        <Link to="/">
          <h3 className=" flex text-lg gap-1 justify-center items-center text-green-100 font-bold">
            <span className="flex h-5  w-5 items-center justify-center rounded-full bg-green-600 "> <i class="fa-solid fa-bolt text-xs" style={{ color: "#f0efef" }}></i> </span>
            <p> <span className="text-lg   text-green-600 font-michroma">Volt</span>Spot</p>
          </h3>
        </Link>
      </header>
          <img
            src={loginPatnerImg}
            alt="VoltSpot device"
            width={1024}
            height={1408}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="relative z-10 flex h-full min-h-[280px] flex-col justify-end p-6 sm:min-h-[360px] sm:p-8 lg:min-h-[640px] lg:p-10">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-green-500/30 bg-zinc-900/70 px-3 py-1 text-xs font-medium text-green-400 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              Live partner network
            </span>
            <h2 className="mt-4 text-2xl font-semibold leading-[1.1] tracking-tight sm:text-3xl lg:mt-5 lg:text-4xl xl:text-5xl">
              Power your drive.<br />
              <span className="text-zinc-500">Anywhere, anytime.</span>
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-500 lg:mt-4">
              Manage partner stations, track energy use, and grow your network — all in one place.
            </p>
          </div>
        </section>

        {/* ── right form panel ── */}
        <section className="flex items-center lg:px-6">
          <div className="mx-auto w-full max-w-md">

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {InsideTheRegister ? "Join as partner" : "Welcome back"}
            </h1>
            <p className="mt-2 text-sm text-zinc-500 sm:mt-3">
              {InsideTheRegister
                ? "Register your company to start collaborating."
                : "Sign in to continue to your partner workspace."}
            </p>

            <form
              autoComplete="off"
              onSubmit={InsideTheRegister ? panterRegisterHandle : PatnerLoginHandle}
              className="mt-8 space-y-5 sm:mt-10"
            >
              {/* company name (register only) */}
              {InsideTheRegister && (
                <div className="space-y-2">
                  <label htmlFor="StationName" className="block text-sm font-medium text-zinc-400">
                    Company name
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                      <Building2 className="h-4 w-4" />
                    </span>
                    <input
                      id="StationName"
                      type="text"
                      placeholder="Acme Inc."
                      value={patnerInput.StationName}
                      onChange={(e) => setPatnerInput({ ...patnerInput, StationName: e.target.value })}
                      className="h-12 w-full rounded-xl border border-zinc-700 bg-zinc-800/60 pl-10 pr-4 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* email */}
              <div  className="space-y-2">
                 <label htmlFor="address" className="block text-sm font-medium text-zinc-400">
                      Email
                    </label>
                <input
                className='w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-colors resize-none'
                  id="email"
                  type="email"
                  label="Email"
                  placeholder="you@company.com"
                  value={patnerInput.email}
                  onChange={(e) => setPatnerInput({ ...patnerInput, email: e.target.value })}
                />
  
              </div>
              {/* password */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-zinc-400">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="pass"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Enter password"
                    value={patnerInput.password}
                    onChange={(e) => setPatnerInput({ ...patnerInput, password: e.target.value })}
                    className="h-12 w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 pr-12 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-colors"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* strength rules (register only) */}
                {InsideTheRegister && (
                  <ul className="mt-3 grid gap-1.5 text-xs sm:grid-cols-3">
                    {rules.map((r) => {
                      const ok = r.test(patnerInput.password);
                      return (
                        <li
                          key={r.label}
                          className={`flex items-center gap-1.5 transition-colors ${ok ? "text-green-400" : "text-zinc-500"}`}
                        >
                          <span
                            className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${ok ? "border-green-500 bg-green-500/15" : "border-zinc-700"
                              }`}
                          >
                            {ok && <Check className="h-2.5 w-2.5" />}
                          </span>
                          <span className="truncate">{r.label}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* address (register only) */}
              {InsideTheRegister && (
                <div className="space-y-2">
                  <label htmlFor="address" className="block text-sm font-medium text-zinc-400">
                    Address
                  </label>
                  <textarea
                    id="address"
                    rows={3}
                    placeholder="123 Market St, City"
                    value={patnerInput.address}
                    onChange={(e) => setPatnerInput({ ...patnerInput, address: e.target.value })}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-colors resize-none"
                  />
                </div>
              )}

              {/* forgot password (login only) */}
              {!InsideTheRegister && (
                <div className="flex justify-end">
                  <a href="#" className="text-xs font-medium text-zinc-500 hover:text-green-400 transition-colors">
                    Forgot password?
                  </a>
                </div>
              )}

              {/* submit button */}
              <button
                type="submit"
                disabled={isLoading || isRegister}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-500 text-base font-semibold text-zinc-950 transition-colors hover:bg-green-400 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading || isRegister ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    {InsideTheRegister ? "Registering…" : "Logging in…"}
                  </>
                ) : (
                  <>
                    {InsideTheRegister ? "Create account" : "Sign in"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            {/* switch mode link */}
            <p className=" text-center text-sm text-zinc-500 sm:mt-5 sm:text-left">
              {InsideTheRegister ? "Already a partner? " : "New to VoltSpot? "}
              <Link
                to={InsideTheRegister ? "/logPatners" : "/regPatners"}
                className="font-semibold text-zinc-100 underline-offset-4 hover:underline"
              >
                {InsideTheRegister ? "Sign in" : "Create account"}
              </Link>
            </p>

          </div>
        </section>
      </div>
    </main>
  );
};

export default Authen;