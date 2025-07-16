import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState, type ReactElement } from "react"
import { useLocation, Navigate, Link } from "react-router"
import { jwtDecode } from "jwt-decode"
import { GoogleLogin } from "@react-oauth/google";

type LocationState = {
    message?: string;
};


const Login = () => {
    const [formData, setFormData] = useState<{
        username: string;
        password: string;
    }>({ username: '', password: '' })

    const [navigate, setNavigate] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const location = useLocation();
    const state = location.state as LocationState | null;

    const [toastMessage, setToastMessage] = useState("");

    useEffect(() => {
        if (state?.message) {
            setToastMessage(state.message);

            const timer = setTimeout(() => {
                setToastMessage("");
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [state]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch("https://trellio.onrender.com/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const body = await response.json();
            setIsLoading(false);
            if (body.access) {
                localStorage.setItem("token", body.access);
                localStorage.setItem("username", formData.username);
                localStorage.setItem("isLogged", 'true');
                localStorage.setItem("currentUser", body.user.id);
                localStorage.setItem("profileImage", body.user.image_url);
                setNavigate(true);
            } else {
                setError(true);
            }
        } catch (error) {
            console.error("Login error:", error);
            setIsLoading(false);
            setError(true);
        }
    }

    if (navigate) return <Navigate to='/projects' />;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
                <h1 className="text-xl font-semibold mb-4 text-center text-gray-800">Login to Trellio</h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-red-600">Invalid username or password. Try again.</div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-500 transition"
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="mt-4 text-sm flex justify-between text-gray-500">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                        Remember me
                    </label>

                    <Link to="/forgot-password" className="hover:underline text-indigo-600">
                        Forgot password?
                    </Link>
                </div>

                <div className="my-5 text-center text-sm text-gray-500">or</div>

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={(cred) => {
                            if (cred.credential) {
                                console.log(jwtDecode(cred.credential));
                            } else {
                                console.error("Missing Google Credential");
                            }
                        }} onError={() => console.log("Google login failed")}
                    />
                </div>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-indigo-600 hover:underline">
                        Sign up
                    </Link>
                </div>
            </div>
            {toastMessage && (
                <div className="fixed top-5 right-5 bg-green-300  px-4 py-2 rounded shadow-lg z-50 text-sm">
                    {toastMessage}
                </div>
            )}
        </div>

    );

}

export default Login