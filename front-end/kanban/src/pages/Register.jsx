import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import Banner from '../assets/aaa.jpg';
import { FcGoogle } from "react-icons/fc";
import { OrbitProgress } from 'react-loading-indicators';

export function Register() {
    const [formData, setFormData] = useState({
        username: '',
        password: null,
        email: '',
        nickname: '',
        profile_image: '',
        role: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isRegistered, setIsRegistered] = useState(false);

    function handleChange(e) {
        const { name, value, files } = e.target;
        if (name === "profile_image") {
            setFormData({ ...formData, profile_image: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        const form = new FormData();

        for (const key in formData) {
            if (formData[key]) {
                form.append(key, formData[key]);
            }
        }

        try {
            const response = await fetch('https://trellio.onrender.com/register/', {
                method: 'POST',
                body: form,
            });
            const body = await response.json();
            setIsLoading(false);
            if (!response.ok || body.error) {
                setErrors(body);

            } else {
                setErrors({});
                setIsRegistered(true);
            }
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    }

    if (isRegistered) {
        return <Navigate to="/" />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">Register</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {[
                        { label: "Username", name: "username", type: "text", placeholder: "Enter your username" },
                        { label: "Password", name: "password", type: "password", placeholder: "Enter your password" },
                        { label: "Email", name: "email", type: "email", placeholder: "Enter your email" },
                        { label: "Profile Image", name: "profile_image", type: "file" }
                    ].map((field, idx) => (
                        <div key={idx}>
                            <label htmlFor={field.name} className="block text-sm text-gray-700 mb-1">{field.label}</label>
                            <input
                                type={field.type}
                                id={field.name}
                                name={field.name}
                                onChange={handleChange}
                                required={field.name !== "profile_image"}
                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                                placeholder={field.placeholder}
                            />
                            {errors[field.name] && (
                                <p className="text-sm text-red-600 mt-1">{errors[field.name][0]}</p>
                            )}
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded transition"
                    >
                        {isLoading ? "Registering..." : "Register"}
                    </button>
                </form>

                <div className="text-center text-sm mt-6">
                    Already have an account? <Link to="/" className="text-indigo-600 hover:underline">Log In</Link>
                </div>
            </div>
        </div>
    );
}