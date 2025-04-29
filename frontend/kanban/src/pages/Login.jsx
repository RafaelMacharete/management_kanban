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
    const [isLoading, setIsLoading] = useState(false)

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setIsLoading(true);

        const response = await fetch("http://127.0.0.1:8000/login/", {
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
            console.log(body.user.id);
        } else {
            setError(true)
        }
    }

    if (navigate) {
        return <Navigate to="/projects" />;
    }

    return (
        <div className="flex min-h-screen">
            <div className="max-h-screen w-1/2">
                <img src={Banner} alt="Banner of Kanban" className="w-full h-full" />
            </div>
            <div className="flex flex-col w-1/2 p-6 py-12">
                <form
                    className="bg-white flex flex-col gap-2"
                    onSubmit={handleSubmit}
                >
                    <h2 className="text-3xl font-bold text-center text-[#5030E5] mb-6">
                        <span className="text-black text-2xl">Welcome Back to </span>Trellio
                    </h2>

                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm text-gray-600 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5030E5]"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm text-gray-600 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5030E5]"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 mb-4">
                            Invalid username or password.
                        </p>
                    )}

                    <div className="flex justify-between items-center text-sm mb-4">
                        <span className="text-gray-500">Don't have an account?</span>
                        <Link to="/register" className="text-[#5030E5] hover:underline">
                            Sign up
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#5030E5] text-white py-2 rounded-lg hover:bg-[#4025b8] transition-colors"
                    >
                        {isLoading ? <OrbitProgress color="#9272d2" size="small" text="" textColor="" /> : 'Log in'}
                    </button>
                </form>
                <div>
                    <div className="flex items-center my-6 w-full">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="mx-4 text-gray-500 font-medium">Or</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>


                    <div className="w-full">
                        <button className="border-1 rounded-4xl flex gap-3 w-full h-15 items-center justify-center">

                            <GoogleLogin
                                onSuccess={(credentialResponse) => {
                                    console.log(jwtDecode(credentialResponse.credential))
                                }}
                                onError={() => console.log('Login Failed')}
                                shape="circle"
                                theme="filled_blue"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
