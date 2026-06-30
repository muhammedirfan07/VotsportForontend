import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resendPasswordApi, verifyResetTokenApi } from "../../Server/allAPI";
import { Eye, EyeOff, Lock, CheckCircle2, XCircle, Zap } from "lucide-react";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [checkingToken, setCheckingToken] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
    const verifyToken = async () => {
        try {
            await verifyResetTokenApi(token);
            setTokenValid(true);
        } catch (err) {
            setTokenValid(false);
            setError(err.response?.data?.error || "Reset link is invalid or expired");
        } finally {
            setCheckingToken(false);
        }
    };
    verifyToken();
}, [token]);
 
    const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
    const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            const result = await resendPasswordApi({ newPassword, confirmPassword }, token);
            setMessage(result.data.message);
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };
    // ---------- Main reset form ----------
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
            <div className="w-full max-w-md">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="flex flex-col items-center mb-7">                       
                        <h1 className="text-2xl font-semibold text-white">Reset Password</h1>
                        <p className="text-zinc-400 text-sm mt-1 text-center">
                            Choose a new password to secure your VoltSpot account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* New Password */}
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    required
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword((prev) => !prev)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
                                    tabIndex={-1}
                                >
                                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div> 
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    placeholder="Re-enter new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full pl-10 pr-11 py-3 rounded-xl bg-zinc-800 border text-white placeholder-zinc-500 focus:outline-none focus:ring-2 transition ${
                                        passwordsMismatch
                                            ? "border-red-500/60 focus:ring-red-500 focus:border-red-500"
                                            : passwordsMatch
                                                ? "border-emerald-500/60 focus:ring-emerald-500 focus:border-emerald-500"
                                                : "border-zinc-700 focus:ring-emerald-500 focus:border-emerald-500"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            {passwordsMatch && (
                                <p className="mt-1.5 ml-1 text-xs text-emerald-400 flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                                </p>
                            )}
                            {passwordsMismatch && (
                                <p className="mt-1.5 ml-1 text-xs text-red-400 flex items-center gap-1">
                                    <XCircle className="w-3.5 h-3.5" /> Passwords do not match
                                </p>
                            )}
                        </div>

                        {message && (
                            <p className="text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3.5 py-2.5 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 shrink-0" /> {message}
                            </p>
                        )}
                        {error && (
                            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-xl px-3.5 py-2.5 flex items-center gap-2">
                                <XCircle className="w-4 h-4 shrink-0" /> {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] transition-all text-white font-medium disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                        >
                            {loading && (
                                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            )}
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                </div>

                <p className="text-center text-zinc-600 text-xs mt-6">
                    Remembered your password?{" "}
                    <button
                        onClick={() => navigate("/login")}
                        className="text-emerald-500 hover:text-emerald-400 transition font-medium"
                    >
                        Back to Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;