import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Banner from '../assets/aaa.jpg';
import { OrbitProgress } from 'react-loading-indicators';
import { FaLock } from "react-icons/fa";
import { RiErrorWarningFill } from "react-icons/ri";

export function VerifyResetToken() {
  const location = useLocation();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || "");

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("https://trellio.onrender.com/verify-token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });

      if (res.ok) {
        navigate("/reset-password", { state: { email } });
      } else {
        setError("Invalid token or email");
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
          alt="Verify Token"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#5030E5] to-transparent opacity-80"></div>
        <div className="absolute inset-0 flex flex-col justify-center p-16 text-white">
          <h1 className="text-5xl font-bold mb-4">Verify Your Token</h1>
          <p className="text-xl opacity-90">Check your email for the verification code</p>
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
            <h2 className="text-3xl font-bold text-gray-800">Verify Token</h2>
            <p className="text-gray-500 mt-2">Enter the token sent to your email</p>
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
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5030E5] focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Token
                </label>
                <input
                  type="text"
                  id="token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5030E5] focus:border-transparent transition-all"
                  placeholder="Enter the token"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start">
                <RiErrorWarningFill className="w-5 h-5 mr-2"></RiErrorWarningFill>
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
                'Verify Token'
              )}
            </button>
          </form>

          {/* Back to forgot password */}
          <div className="text-center text-sm mt-8 pt-6 border-t border-gray-100">
            <span className="text-gray-500">Didn't receive a token? </span>
            <Link to="/forgot-password" className="text-[#5030E5] hover:text-[#4025b8] font-medium">Resend Token</Link>
          </div>
        </div>
      </div>
    </div>
  );
}