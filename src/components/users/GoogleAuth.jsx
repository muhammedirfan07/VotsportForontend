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
    setIsLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      const reqBody = {
        fullName: user.displayName,
        email: user.email,
        googleId: user.uid
      }
      const loggingUser = await googleAuthAPI(reqBody)

      if (loggingUser.status === 200) {
        const { user, token } = loggingUser.data
        sessionStorage.setItem("user", JSON.stringify(user))
        socket.connect();
        socket.emit("registerUser", user._id);
        sessionStorage.setItem("token", token)
        toast.success(`Welcome ${user?.fullName || ""} 🎉`, {
          position: "top-right",
          theme: "dark",
        });
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
      disabled={isLoading}
      className="h-12 flex justify-center rounded-2xl text-sm cursor-pointer gap-1.5 hover:text-foreground text-muted-foreground bg-card border border-border hover:border-primary/50 font-medium items-center transition disabled:opacity-60"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (<p>Google</p>)}
    </button>
  )
}

export default GoogleAuth