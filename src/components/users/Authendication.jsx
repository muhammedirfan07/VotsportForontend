import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import evVideo from "../../assets/evVideo.mp4";
import { loginAPI, registerAPI } from "../../Server/allAPI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoogleAuth from "./GoogleAuth";
import socket from "../../Server/socket";

const Autho = ({ insideRegister }) => {
  const navigate = useNavigate();

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [inputData, setInputData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword } = inputData;

    if (!fullName || !email || !password || !confirmPassword) {
      toast.warning("Please fill all fields", { position: "top-right", theme: "dark" });
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { position: "top-right", theme: "dark" });
      return;
    }

    try {
      setIsLoading(true);
      const result = await registerAPI(inputData);
      if (result.status === 200) {
        toast.success(result.data.message, { position: "top-right", theme: "dark" });
        setInputData({ fullName: "", email: "", password: "", confirmPassword: "" });
        navigate("/login");
      } else {
        toast.warning(result.response.data.error, { position: "top-right", theme: "dark" });
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!", { position: "top-right", theme: "dark" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = inputData;

    if (!email || !password) {
      toast.warning("Please enter email and password", { position: "top-right", theme: "dark" });
      return;
    }

    try {
      setIsLoading(true);
      const result = await loginAPI(inputData);
      if (result.status === 200) {
        const { user, token } = result.data;
        sessionStorage.setItem("user", JSON.stringify(user));
        socket.connect();
        socket.emit("registerUser", user._id);
        sessionStorage.setItem("token", token);

        toast.success(`Welcome ${user?.fullName || ""} 🎉`, { position: "top-right", theme: "dark" });
        setInputData({ fullName: "", email: "", password: "", confirmPassword: "" });

        if (user.role === "admin") {
          navigate("/AdminDashboard");
        } else {
          navigate("/");
        }
      } else {
        toast.warning(result.response.data.message, { position: "top-right", theme: "dark" });
      }
    } catch (err) {
      console.log(err);
      toast.error("Login failed. Try again!", { position: "top-right", theme: "dark" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 md:p-20 relative overflow-hidden bg-background text-foreground font-display">

      {/* brand */}
      <div className="absolute hidden md:flex top-6 left-6 z-20">
        <Link to="/">
          <h3 className="flex text-3xl gap-1 text-foreground font-bold">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <i className="fa-solid fa-bolt text-xl text-primary-foreground"></i>
            </span>
            <p><span className="text-3xl text-primary font-heading">Volt</span>Spot</p>
          </h3>
        </Link>
      </div>

      {/* auth card */}
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl grid grid-cols-1 lg:grid-cols-2 bg-card border border-border shadow-2xl">

        {/* left section */}
        <div className="relative min-h-[280px] lg:min-h-[640px] p-2 md:p-8 overflow-hidden">
          <video
            src={evVideo}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-tr from-background/90 via-background/40 to-transparent" />

          <div className="relative z-10 flex h-full flex-col justify-between p-4 md:p-6 sm:p-10">
            <div className="flex items-center gap-2">
              <Link to="/">
                <h3 className="flex md:hidden text-xl gap-2 text-foreground font-bold">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                    <i className="fa-solid fa-bolt text-xl text-primary-foreground"></i>
                  </span>
                  <p><span className="text-2xl text-primary font-heading">Volt</span>Spot</p>
                </h3>
              </Link>
            </div>
            <div className="hidden md:flex w-40 h-8"> </div>

            <div className="max-w-sm space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs backdrop-blur border border-border bg-background/40 text-foreground">
                <span className="h-1.5 w-1.5 rounded-full animate-pulse bg-primary" />
                Live charging network
              </div>

              <h1 className="text-3xl sm:text-4xl font-heading font-semibold tracking-tight leading-tight text-foreground">
                Power your drive.
                <br />
                Anywhere, anytime.
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Manage your EV charging sessions, track energy use, and pay seamlessly.
              </p>
            </div>
          </div>
        </div>

        {/* right section */}
        <div className="flex items-center justify-center p-4 md:p-6 bg-card">
          <div className="w-full max-w-md space-y-7">
            {/* heading */}
            <div className="space-y-2">
              <h2 className="text-2xl md:text-4xl font-heading font-semibold tracking-tight text-foreground">
                {insideRegister ? "Create account" : "Welcome back"}
              </h2>
              <p className="text-xs md:text-lg text-muted-foreground">
                {insideRegister
                  ? "Create your VoltSpot account to continue."
                  : "Sign in to continue your EV journey."}
              </p>
            </div>

            {/* form */}
            <form className="space-y-4" onSubmit={insideRegister ? handleRegister : handleLogin}>
              {insideRegister && (
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={inputData.fullName}
                    onChange={(e) => setInputData({ ...inputData, fullName: e.target.value })}
                    className="h-12 w-full rounded-2xl px-4 text-sm transition focus:outline-none bg-secondary/60 border border-border text-foreground"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={inputData.email}
                  onChange={(e) => setInputData({ ...inputData, email: e.target.value })}
                  className="h-12 w-full rounded-2xl px-4 text-sm transition focus:outline-none bg-secondary/60 border border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Password</label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    placeholder="Enter password"
                    value={inputData.password}
                    onChange={(e) => setInputData({ ...inputData, password: e.target.value })}
                    className="h-12 w-full rounded-2xl px-4 pr-12 text-sm transition focus:outline-none bg-secondary/60 border border-border text-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPwd ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {insideRegister && (
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPwd ? "text" : "password"}
                      placeholder="Confirm password"
                      value={inputData.confirmPassword}
                      onChange={(e) => setInputData({ ...inputData, confirmPassword: e.target.value })}
                      className="h-12 w-full rounded-2xl px-4 pr-12 text-sm transition focus:outline-none bg-secondary/60 border border-border text-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showConfirmPwd ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group inline-flex bg-primary cursor-pointer hover:opacity-90 text-primary-foreground h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition-all duration-300 disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    {insideRegister ? "Create account" : "Sign in"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">or continue with</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* social */}
            <div className="grid grid-cols-1">
              <GoogleAuth />
            </div>

            {/* switch auth */}
            <p className="text-center text-sm text-muted-foreground">
              {insideRegister ? "Already have an account?" : "New to VoltSpot?"}{" "}
              <Link
                className="text-foreground font-semibold underline underline-offset-[3px] hover:opacity-80 transition-all"
                to={insideRegister ? "/login" : "/register"}
              >
                {insideRegister ? "Sign in" : "Create account"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Autho;