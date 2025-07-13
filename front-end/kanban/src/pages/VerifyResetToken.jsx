import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { OrbitProgress } from 'react-loading-indicators';
import { FaLock } from "react-icons/fa";
import { RiErrorWarningFill } from "react-icons/ri";

export function VerifyResetToken() {
  const location = useLocation();
  const [token, setToken] = useState("");
  const [email, setEmail] = useState(location.state?.email || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm">
        <div className="text-center mb-6">
          <div className="mx-auto w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FaLock className="text-[#5030E5] w-6 h-6" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Verify Token</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="token" className="block text-sm text-gray-700 mb-1">Verification Token</label>
            <input
              type="text"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
              placeholder="Enter token"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 flex items-center gap-2">
              <RiErrorWarningFill className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#5030E5] hover:bg-[#4025b8] text-white font-medium py-2 rounded-md transition-all"
          >
            {isLoading ? <OrbitProgress color="#ffffff" size="small" /> : "Verify Token"}
          </button>
        </form>

        <div className="text-center text-sm mt-6 text-gray-600">
          Didn't get a token?{" "}
          <Link to="/forgot-password" className="text-[#5030E5] hover:underline">Resend</Link>
        </div>
      </div>
    </div>
  );
}
