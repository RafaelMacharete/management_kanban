import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Banner from '../assets/aaa.jpg';
import { OrbitProgress } from 'react-loading-indicators';
import { FaLock } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { RiErrorWarningFill } from "react-icons/ri";

export function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch("http://trellio.onrender.com/send-reset-email/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage("Token sent! Check your email.");
                setError("");
                setTimeout(() => {
                    navigate("/verify-reset-token", { state: { email } });
                }, 1500);
            } else {
                setError(data.error || "Failed to send email.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Banner Side */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden">
                <img
                    src={Banner}
                    alt="Password Recovery"
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#5030E5] to-transparent opacity-80"></div>
                <div className="absolute inset-0 flex flex-col justify-center p-16 text-white">
                    <h1 className="text-5xl font-bold mb-4">Reset Your Password</h1>
                    <p className="text-xl opacity-90">We'll help you get back into your account</p>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-10">
                    {/* Header with icon */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-[#5030E5]/10 rounded-full flex items-center justify-center mb-4">
                            <FaLock className="text-[#5030E5] w-8 h-8"></FaLock>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Forgot Password?</h2>
                        <p className="text-gray-500 mt-2">Enter your email to receive a reset token</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5030E5] focus:border-transparent transition-all"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        {message && !error &&(
                            <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg flex">
                                <FaCheckCircle className="w-5 h-5"></FaCheckCircle>
                                <span>{message}</span>
                            </div>
                        )}


                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex">
                                <RiErrorWarningFill className="w-5 h-5"></RiErrorWarningFill>
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center bg-[#5030E5] hover:bg-[#4025b8] text-white font-medium py-3 px-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
                        >
                            {isLoading ? (
                                <OrbitProgress color="#ffffff" size="small" text="" textColor="" />
                            ) : (
                                'Send Reset Token'
                            )}
                        </button>
                    </form>

                    {/* Back to login */}
                    <div className="text-center text-sm mt-8 pt-6 border-t border-gray-100">
                        <span className="text-gray-500">Remembered your password? </span>
                        <Link to="/" className="text-[#5030E5] hover:text-[#4025b8] font-medium">Log In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}