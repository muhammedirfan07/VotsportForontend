// OTPInput.jsx — styling only, theme-aware
import React, { useState, useRef, useEffect } from "react";
import { EmailVerifationAPI, reSendOtpAPI } from "../../../Server/allAPI";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";


const OTPInput = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resendOtp, setResendOtp] = useState(false)
  const inputRefs = useRef([]);

  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.split("").slice(0, 6);
    const newOtp = [...otp];

    digits.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit;
      }
    });

    setOtp(newOtp);

    if (digits.length < 6) {
      inputRefs.current[digits.length].focus();
    } else {
      inputRefs.current[5].focus();
    }
  };

  const handleSubmit = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.warning("Please enter a complete OTP", { position: "top-right", theme: "dark" });
      return;
    }

    setLoading(true);
    try {
      const response = await EmailVerifationAPI({ code: otpValue });

      if (response.status === 200) {
        toast.success(" Email verified successfully!", { position: "top-right", theme: "dark" });
        setMessage(" Email verified successfully!");

        setTimeout(() => {
          setMessage("");
          navigate('/logPatners')
          setLoading(true);
        }, 3000)
      } else {
        toast.error(" Invalid or expired OTP. Try again.", { position: "top-right", theme: "dark" });
        setMessage(" Invalid or expired OTP. Try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Something went wrong. Please try again.", { position: "top-right", theme: "dark" });
      setMessage(" Something went wrong. Please try again.");
    }

    setLoading(false);
  };
  const HandleResend = async () => {
    const email = location.state?.email
    if (!email) {
      toast.error("Email not Founded . plz register again", { theme: "dark", position: "bottom-right" })
    }
    setResendOtp(true)
    try {
      const result = await reSendOtpAPI({ email })
      if (result.status === 200) {
        toast.success("OTP resent! Check your email.", { theme: "dark", position: "bottom-right" })
        setOtp(["", "", "", "", "", ""])
        inputRefs.current[0].focus()
      } else {
        toast.error("Failed to resend OTP.", { theme: "dark", position: "bottom-right" });
      }
    } catch (error) {
      toast.error("Something went wrong.", { theme: "dark", position: "bottom-right" });
    }
    setResendOtp(false)
  }

  return (
    <div className="bg-background min-h-screen text-foreground flex items-center justify-center">
      <div className="flex flex-col items-center justify-center p-8 border border-border bg-card drop-shadow-lg rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 font-heading text-foreground">Enter Verification Code</h2>
        <p className="text-muted-foreground mb-4">We've sent a 6-digit code to your email.</p>

        <div className="flex gap-2 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="w-12 h-14 text-center shadow-md text-xl font-semibold bg-input text-foreground border border-border rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || otp.join("").length !== 6}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        {message && <p className="mt-3 text-sm font-medium text-muted-foreground">{message}</p>}

        <div className="mt-4 text-sm text-muted-foreground">
          Didn't receive code? <button onClick={HandleResend} className="text-primary font-medium hover:underline">{resendOtp ? "Sending...." : "Resend"}</button>
        </div>
      </div>
    </div>
  );
};

export default OTPInput;