import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Zap,
  ArrowRight,
  Loader2,
} from "lucide-react";
import evVideo from "../../assets/evVideo.mp4"
import { loginAPI, registerAPI } from "../../Server/allAPI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoogleAuth from "./GoogleAuth";

const Autho = ({ insideRegister }) => {
  const navigate = useNavigate();

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [inputData, setInputData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ---------------- register ----------------
  const handleRegister = async (e) => {
    e.preventDefault();

    const {
      fullName,
      email,
      password,
      confirmPassword,
    } = inputData;

    if (
      !fullName ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      toast.warning("Please fill all fields", {
        position: "top-right",
        theme: "dark",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-right",
        theme: "dark",
      });
      return;
    }

    try {
      setIsLoading(true);

      const result = await registerAPI(inputData);

      if (result.status === 200) {
        toast.success(result.data.message, {
          position: "top-right",
          theme: "dark",
        });

        setInputData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        navigate("/login");
      } else {
        toast.warning(result.response.data.error, {
          position: "top-right",
          theme: "dark",
        });
      }
    } catch (err) {
      console.log(err);

      toast.error("Something went wrong!", {
        position: "top-right",
        theme: "dark",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- login ----------------
  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = inputData;

    if (!email || !password) {
      toast.warning(
        "Please enter email and password",
        {
          position: "top-right",
          theme: "dark",
        }
      );
      return;
    }

    try {
      setIsLoading(true);

      const result = await loginAPI(inputData);

      if (result.status === 200) {
        const { user, token } = result.data;

        sessionStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        sessionStorage.setItem("token", token);

        toast.success(
          `Welcome ${user?.fullName || ""} 🎉`,
          {
            position: "top-right",
            theme: "dark",
          }
        );

        setInputData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        if (user.role === "admin") {
          navigate("/AdminDashboard");
        } else {
          navigate("/");
        }
      } else {
        toast.warning(result.response.data.message, {
          position: "top-right",
          theme: "dark",
        });
      }
    } catch (err) {
      console.log(err);

      toast.error("Login failed. Try again!", {
        position: "top-right",
        theme: "dark",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen w-full flex items-center justify-center p-4 md:p-20 relative overflow-hidden"
      style={{
        background: "oklch(0.14 0.01 260)",
        color: "oklch(0.98 0.005 260)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >

      {/* brand */}
      <div className="absolute hidden md:flex top-6 left-6 z-20">
        <Link to="/">
          <h3 className=" flex text-3xl gap-1 p text-green-100 font-bold">
            <span className="flex h-10  w-10 items-center justify-center rounded-full bg-green-600 "> <i class="fa-solid fa-bolt text-xl" style={{ color: "#f0efef" }}></i> </span>
            <p> <span className="text-3xl   text-green-600 font-michroma">Volt</span>Spot</p>
          </h3>
        </Link>
      </div>

      {/* auth card */}
      <div
        className="w-full max-w-6xl overflow-hidden rounded-3xl grid grid-cols-1 lg:grid-cols-2"
        style={{
          background: "oklch(0.18 0.012 260)",
          border:
            "1px solid oklch(0.28 0.012 260)",
          boxShadow:
            "0 25px 60px -12px rgba(0,0,0,0.6)",
        }}
      >
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

          {/* overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top right, oklch(0.14 0.01 260 / 0.9), oklch(0.14 0.01 260 / 0.4), transparent)",
            }}
          />

          <div className="relative z-10 flex h-full flex-col justify-between p-4 md:p-6 sm:p-10">
            {/* logo */}
            <div className=" flex   items-center gap-2">
              <Link to="/">
                <h3 className=" flex md:hidden text-xl gap-2 text-green-100 font-bold">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 "> <i class="fa-solid fa-bolt text-xl" style={{ color: "#f0efef" }}></i> </span>
                  <p> <span className="text-2xl  text-green-600 font-michroma">Volt</span>Spot</p>
                </h3>
              </Link>
            </div>
            <div className="hidden md:flex w-40  h-8"> </div>

            {/* content */}
            <div className="max-w-sm space-y-3">

              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs backdrop-blur"
                style={{
                  border: "1px solid oklch(0.28 0.012 260 / 0.6)",
                  backgroundColor: "oklch(0.14 0.01 260 / 0.4)",
                  color: "oklch(0.98 0.005 260)",
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full animate-pulse"
                  style={{
                    backgroundColor: "oklch(0.7 0.22 145)",
                  }}
                />

                Live charging network
              </div>

              <h1
                className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight"
                style={{
                  color: "oklch(0.98 0.005 260)",
                }}
              >
                Power your drive.
                <br />
                Anywhere, anytime.
              </h1>
              <p
                className=" text-xs md:text-sm"
                style={{
                  color: "oklch(0.65 0.015 260)",
                }}
              >
                Manage your EV charging sessions, track energy use, and pay seamlessly.
              </p>

            </div>
          </div>
        </div>
        {/* right section */}
        <div
          className="flex items-center justify-center p-4 md:p-6 "
          style={{
            background: "oklch(0.18 0.012 260)",
          }}
        >
          <div className="w-full max-w-md space-y-7">
            {/* heading */}
            <div className="space-y-2">
              <h2
                className="text-2xl md:text-4xl"
                style={{
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  color: "oklch(0.98 0.005 260)",
                }}
              >
                {insideRegister
                  ? "Create account"
                  : "Welcome back"}
              </h2>

              <p
                className=" text-xs md:text-lg"
                style={{
                  color: "oklch(0.65 0.015 260)",
                  fontSize: "0.875rem",
                }}
              >
                {insideRegister
                  ? "Create your VoltSpot account to continue."
                  : "Sign in to continue your EV journey."}
              </p>
            </div>

            {/* form */}
            <form
              className="space-y-4"
              onSubmit={
                insideRegister
                  ? handleRegister
                  : handleLogin
              }
            >
              {/* full name */}
              {insideRegister && (
                <div className="space-y-2">
                  <label
                    style={{
                      color:
                        "oklch(0.65 0.015 260)",
                      fontSize: "0.875rem",
                    }}
                  >
                    Full Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={inputData.fullName}
                    onChange={(e) =>
                      setInputData({
                        ...inputData,
                        fullName: e.target.value,
                      })
                    }
                    className="h-12 w-full rounded-2xl px-4 text-sm transition focus:outline-none"
                    style={{
                      background:
                        "oklch(0.24 0.012 260 / 0.5)",
                      border:
                        "1px solid oklch(0.28 0.012 260)",
                      color:
                        "oklch(0.98 0.005 260)",
                    }}
                  />
                </div>
              )}

              {/* email */}
              <div className="space-y-2">
                <label
                  style={{
                    color:
                      "oklch(0.65 0.015 260)",
                    fontSize: "0.875rem",
                  }}
                >
                  Email
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={inputData.email}
                  onChange={(e) =>
                    setInputData({
                      ...inputData,
                      email: e.target.value,
                    })
                  }
                  className="h-12 w-full rounded-2xl px-4 text-sm transition focus:outline-none"
                  style={{
                    background:
                      "oklch(0.24 0.012 260 / 0.5)",
                    border:
                      "1px solid oklch(0.28 0.012 260)",
                    color:
                      "oklch(0.98 0.005 260)",
                  }}
                />
              </div>

              {/* password */}
              <div className="space-y-2">
                <label
                  style={{
                    color:
                      "oklch(0.65 0.015 260)",
                    fontSize: "0.875rem",
                  }}
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    type={
                      showPwd ? "text" : "password"
                    }
                    placeholder="Enter password"
                    value={inputData.password}
                    onChange={(e) =>
                      setInputData({
                        ...inputData,
                        password: e.target.value,
                      })
                    }
                    className="h-12 w-full rounded-2xl px-4 pr-12 text-sm transition focus:outline-none"
                    style={{
                      background:
                        "oklch(0.24 0.012 260 / 0.5)",
                      border:
                        "1px solid oklch(0.28 0.012 260)",
                      color:
                        "oklch(0.98 0.005 260)",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPwd(!showPwd)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    style={{
                      color:
                        "oklch(0.65 0.015 260)",
                    }}
                  >
                    {showPwd ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* confirm password */}
              {insideRegister && (
                <div className="space-y-2">
                  <label
                    className="text-sm text-[oklch(0.65_0.015_260)]"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">
                    <input
                      type={
                        showConfirmPwd
                          ? "text"
                          : "password"
                      }
                      placeholder="Confirm password"
                      value={
                        inputData.confirmPassword
                      }
                      onChange={(e) =>
                        setInputData({
                          ...inputData,
                          confirmPassword:
                            e.target.value,
                        })
                      }
                      className="h-12 w-full rounded-2xl px-4 pr-12 text-sm transition focus:outline-none"
                      style={{
                        background:
                          "oklch(0.24 0.012 260 / 0.5)",
                        border:
                          "1px solid oklch(0.28 0.012 260)",
                        color:
                          "oklch(0.98 0.005 260)",
                      }}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPwd(
                          !showConfirmPwd
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      style={{
                        color:
                          "oklch(0.65 0.015 260)",
                      }}
                    >
                      {showConfirmPwd ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              )}
              <div className="flex justify-end">
                <a onClick={()=>navigate("/forgot-password")} href="#" className="text-xs font-medium text-zinc-500 hover:text-green-400 transition-colors">
                  Forgot password?
                </a>
              </div>

              {/* submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="group inline-flex bg-green-600  cursor-pointer hover:bg-green-500 text-black h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition-all duration-300 disabled:opacity-70"

              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    {insideRegister
                      ? "Create account"
                      : "Sign in"}

                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* divider */}
            <div className="flex items-center gap-3 ">
              <div
                className="h-px flex-1 bg-[oklch(0.28_0.012_260)]"
              />

              <span className="text-xs text-[oklch(0.65_0.015_260)]"
              >
                or continue with
              </span>

              <div
                className="h-px flex-1 bg-[oklch(0.28_0.012_260)]"

              />
            </div>

            {/* social */}
            <div className="grid grid-cols-1">
              <GoogleAuth />

            </div>

            {/* switch auth */}
            <p className="text-center text-sm text-[oklch(0.65_0.015_260)]"
            >
              {insideRegister
                ? "Already have an account?"
                : "New to VoltSpot?"}{" "}
              <Link
                className=" text-white font-semibold underline underline-offset-[3px] hover:text-white/80 transition-all"
                to={
                  insideRegister
                    ? "/login"
                    : "/register"
                }
              >
                {insideRegister

                  ? "Sign in"
                  : "Create account"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Autho;