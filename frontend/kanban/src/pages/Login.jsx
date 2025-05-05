import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import Banner from '../assets/aaa.jpg'
import { OrbitProgress } from 'react-loading-indicators'
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from 'jwt-decode'

export function Login() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [navigate, setNavigate] = useState(false);
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setIsLoading(true);

        const response = await fetch("https://trellio.onrender.com/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(formData),
        });
        const body = await response.json();
        setIsLoading(false)
        if (body.access) {
            localStorage.setItem('token', body.access)
            setNavigate(true);
            localStorage.setItem('username', formData.username)
            localStorage.setItem('isLogged', true)
            localStorage.setItem('id', body.user.id)
        } else {
            setError(true)
        }
    }

    if (navigate) {
        return <Navigate to="/projects" />;
    }
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Banner - Melhorado com overlay e alinhamento */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden">
                <img
                    src={Banner}
                    alt="Login Illustration"
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#5030E5] to-transparent opacity-80"></div>
                <div className="absolute inset-0 flex flex-col justify-center p-16 text-white">
                    <h1 className="text-5xl font-bold mb-4">Welcome to Trellio</h1>
                    <p className="text-xl opacity-90">Organize your projects efficiently with our powerful task management system.</p>
                </div>
            </div>

            {/* Form - Ajustado para melhor espaçamento */}
            <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-10">
                    {/* Título com ícone */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-[#5030E5]/10 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-[#5030E5]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">
                            Welcome Back to <span className="text-[#5030E5]">Trellio</span>
                        </h2>
                        <p className="text-gray-500 mt-2">Sign in to continue to your dashboard</p>
                    </div>

                    {/* Formulário com melhor espaçamento */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5030E5] focus:border-transparent transition-all"
                                    placeholder="Enter your username"
                                    required
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5030E5] focus:border-transparent transition-all"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start">
                                <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>Invalid username or password. Please try again.</span>
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-[#5030E5] focus:ring-[#5030E5] border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link to={"/forgot-password"} className="font-medium text-[#5030E5] hover:text-[#4025b8]">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center bg-[#5030E5] hover:bg-[#4025b8] text-white font-medium py-3 px-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
                        >
                            {isLoading ? (
                                <OrbitProgress color="#ffffff" size="small" text="" textColor="" />
                            ) : (
                                'Log in'
                            )}
                        </button>
                    </form>

                    {/* Divider com melhor estilo */}
                    <div className="my-6 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-3 bg-white text-sm text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    {/* Google button centralizado */}
                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={(cred) => console.log(jwtDecode(cred.credential))}
                            onError={() => console.log('Login Failed')}
                            shape="pill"
                            theme="filled_blue"
                            size="large"
                            width="300"
                        />
                    </div>

                    {/* Footer com melhor espaçamento */}
                    <div className="text-center text-sm mt-8 pt-6 border-t border-gray-100">
                        <span className="text-gray-500">Don't have an account? </span>
                        <Link to="/register" className="text-[#5030E5] hover:text-[#4025b8] font-medium">Sign up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}