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
            const response = await fetch('http://localhost:8000/register/', {
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
        <div className="flex min-h-screen">
            {/* Form Side */}
            <div className="flex flex-col w-1/2 p-6 py-12">
                <form className="bg-white flex flex-col gap-4" onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-bold text-center text-black mb-6">
                        Register
                    </h2>

                    {/* Fields */}
                    {[
                        { label: "Username", name: "username", type: "text" },
                        { label: "Password", name: "password", type: "password" },
                        { label: "Email", name: "email", type: "email" },
                        { label: "Profile Image", name: "profile_image", type: "file" },
                    ].map((field, index) => (
                        <div key={index} className="mb-2">
                            <label htmlFor={field.name} className="block text-sm text-gray-600 mb-1">
                                {field.label}
                            </label>
                            <input
                                type={field.type}
                                id={field.name}
                                name={field.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5030E5]"
                                required={field.name !== "profile_image"}
                            />
                            {errors[field.name] && (
                                <p className="text-sm text-red-600 mt-1">{errors[field.name][0]}</p>
                            )}


                        </div>
                    ))}

                    {/* Footer */}
                    <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-gray-500">Already have an account?</span>
                        <Link to="/" className="text-[#5030E5] hover:underline">
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

                {/* Divider */}
                <div className="flex items-center my-6 w-full">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="mx-4 text-gray-500 font-medium">Or</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Google Button */}
                <div className="w-full">
                    <button className="border rounded-lg flex gap-3 w-full py-3 items-center justify-center hover:bg-gray-100 transition">
                        <FcGoogle size={24} />
                        Continue with Google
                    </button>
                </div>
            </div>

            {/* Banner Side */}
            <div className="max-h-screen w-1/2">
                <img src={Banner} alt="Banner of Kanban" className="w-full h-full object-cover" />
            </div>
        </div>
    );
}
