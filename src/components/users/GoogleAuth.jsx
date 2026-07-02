import { signInWithPopup } from 'firebase/auth'
import React, { useState } from 'react'
import { auth, googleProvider } from '../../firebase/config'
import { googleAuthAPI } from '../../Server/allAPI'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import socket from '../../Server/socket'


function GoogleAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const googleAuth = async (e) => {
    e.preventDefault()

    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      console.log(" google logging user  =", result.user);

      const reqBody = {
        fullName: user.displayName,
        email: user.email,
        googleId: user.uid
      }
      console.log(" reqbody =", reqBody);
      const loggingUser = await googleAuthAPI(reqBody)
      console.log("logginUser =", loggingUser);

      if (loggingUser.status === 200) {
        const { user, token } = loggingUser.data
        sessionStorage.setItem("user", JSON.stringify(user))
        socket.connect();
        socket.emit("registerUser", user._id);
        sessionStorage.setItem("token", token)
        toast.success(
          `Welcome ${user?.fullName || ""} 🎉`,
          {
            position: "top-right",
            theme: "dark",
          }
        );
        navigate('/')
      }
    } catch (error) {
      console.log(error);
      toast.error("Login failed. Try again!", {
        position: "top-right",
        theme: "dark",
      });
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={googleAuth}
      type="button"
      className="h-12 flex justify-center rounded-2xl text-sm cursor-pointer gap-1.5 hover:text-gray-100 text-white/60 bg-black/40 border border-neutral-800 hover:border-gray-700 font-medium items-center transition"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (<p>Google</p>)

      }
    </button>
  )
}

export default GoogleAuth