import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Banner from '../assets/aaa.jpg';
import { OrbitProgress } from 'react-loading-indicators';
import { RiErrorWarningFill } from "react-icons/ri";
import { FaLock } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";

export function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const email = location.state?.email;

    if (!email) {
        return (
            <div className="flex min-h-screen bg-neutral-100 items-center justify-center">
                <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-sm text-center border border-neutral-200">
                    <div className="text-neutral-500 mb-4">
                        <RiErrorWarningFill className="w-10 h-10 mx-auto" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">No Email Provided</h2>
                    <p className="text-sm text-neutral-500 mb-5">
                        Please start the password reset process again.
                    </p>
                    <Link
                        to="/forgot-password"
                        className="block w-full text-sm text-white bg-black hover:bg-neutral-800 px-4 py-2 rounded-md transition-colors"
                    >
                        Go Back
                    </Link>
                </div>
            </div>
        );
    }


    async function handleSubmit(e) {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("http://trellio.onrender.com/reset-password/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                setSuccess("Password reset successfully! Redirecting to login...");
                setTimeout(() => navigate("/"), 2000);
            } else {
                setError("Failed to reset password. Please try again.");
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
                    alt="Reset Password"
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#5030E5] to-transparent opacity-80"></div>
                <div className="absolute inset-0 flex flex-col justify-center p-16 text-white">
                    <h1 className="text-5xl font-bold mb-4">Set New Password</h1>
                    <p className="text-xl opacity-90">Create a strong password to secure your account</p>
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
                        <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
                        <p className="text-gray-500 mt-2">Create a new password for your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    readOnly
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5030E5] focus:border-transparent transition-all"
                                    placeholder="Enter new password"
                                    required
                                    minLength="1"
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5030E5] focus:border-transparent transition-all"
                                    placeholder="Confirm new password"
                                    required
                                    minLength="1"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex gap-2">
                                <RiErrorWarningFill className="w-5 h-5"></RiErrorWarningFill>
                                <span>{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg flex items-start">
                                <FaCheckCircle className="w-5 h-5"></FaCheckCircle>

                                <span>{success}</span>
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
                                'Reset Password'
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