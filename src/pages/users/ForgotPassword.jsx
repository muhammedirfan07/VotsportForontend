import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { forgotPasswordApi } from "../../Server/allAPI";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
     console.log("email=" ,email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);
        try {
            const res = await forgotPasswordApi({email})
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
                <h1 className="text-2xl font-semibold text-white mb-2">Forgot Password</h1>
                <p className="text-zinc-400 text-sm mb-6">
                    Enter your registered email and we'll send you a reset link.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        required
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />

                    {message && (
                        <p className="text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">
                            {message}
                        </p>
                    )}
                    {error && (
                        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition text-white font-medium disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="w-full text-zinc-400 text-sm hover:text-white transition"
                    >
                        Back to Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;