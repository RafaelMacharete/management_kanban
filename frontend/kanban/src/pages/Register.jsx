import { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import Banner from '../assets/aaa.jpg'
import { FcGoogle } from "react-icons/fc";
import { OrbitProgress } from 'react-loading-indicators'

export function Register() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''

    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false)
    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setIsLoading(true);

        const response = await fetch('http://127.0.0.1:8000/createuser/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        const body = await response.json()

        setIsLoading(false)

        if (body.error) {
            setError(true)
        } else {
            setError(false)
            setIsRegistered(true)
        }

    }

    if (isRegistered) {
        return <Navigate to="/" />;
    }

    return (
            <div className="flex min-h-screen">
                <div className="flex flex-col w-1/2 p-6 py-12">
                    <form
                        className="bg-white flex flex-col gap-2"
                        onSubmit={handleSubmit}
                    >
                        <h2 className="text-2xl font-bold text-center text-[#5030E5] mb-6">
                            Register
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
                                Username already exists
                            </p>
                        )}
                        <div className="flex justify-between items-center text-sm mb-4">
                            <span className="text-gray-500">Don't have an account?</span>
                            <Link to="/" className="text-[#5030E5] hover:underline" >
                                Log In
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#5030E5] text-white py-2 rounded-lg hover:bg-[#4025b8] transition-colors"
                        >
                            {isLoading ? <OrbitProgress color="#9272d2" size="small" text="" textColor="" /> : 'Register'}
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
                                <FcGoogle size={30} />

                                Continue with Google
                            </button>
                        </div>
                    </div>
                </div>
                <div className="max-h-screen w-1/2">
                    <img src={Banner} alt="Banner of Kanban" className="w-full h-full" />
                </div>
            </div>
    )
}