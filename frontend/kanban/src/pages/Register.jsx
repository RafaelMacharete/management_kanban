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
            console.log(body)
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
        <div className="flex min-h-screen bg-gray-50">
            {/* Formulário - Estilo consistente com Login */}
            <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-10">
                    {/* Cabeçalho com ícone */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-[#5030E5]/10 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-[#5030E5]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Create your account</h2>
                        <p className="text-gray-500 mt-2">Join us to start organizing your projects</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            {[
                                { label: "Username", name: "username", type: "text" },
                                { label: "Password", name: "password", type: "password" },
                                { label: "Email", name: "email", type: "email" },
                                { label: "Profile Image", name: "profile_image", type: "file" },
                            ].map((field, index) => (
                                <div key={index} className="mb-2">
                                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                                        {field.label}
                                    </label>
                                    <input
                                        type={field.type}
                                        id={field.name}
                                        name={field.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5030E5] focus:border-transparent transition-all"
                                        required={field.name !== "profile_image"}
                                    />
                                    {errors[field.name] && (
                                        <div className="mt-1 text-sm text-red-600 flex items-start">
                                            <svg className="w-4 h-4 mr-1 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <span>{errors[field.name][0]}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center items-center bg-[#5030E5] hover:bg-[#4025b8] text-white font-medium py-3 px-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <OrbitProgress color="#ffffff" size="small" text="" textColor="" />
                            ) : (
                                'Register'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-3 bg-white text-sm text-gray-500">Or</span>
                        </div>
                    </div>

                    {/* Google button */}
                    <button className="flex items-center justify-center w-full border border-gray-300 rounded-lg py-3 gap-3 hover:bg-gray-50 transition-colors">
                        <FcGoogle size={20} />
                        <span className="text-sm font-medium">Continue with Google</span>
                    </button>

                    {/* Footer */}
                    <div className="text-center text-sm mt-8 pt-6 border-t border-gray-100">
                        <span className="text-gray-500">Already have an account? </span>
                        <Link to="/" className="text-[#5030E5] hover:text-[#4025b8] font-medium">Log In</Link>
                    </div>
                </div>
            </div>

            {/* Banner - Estilo consistente com Login */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden">
                <img
                    src={Banner}
                    alt="Register Banner"
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#5030E5] to-transparent opacity-80"></div>
                <div className="absolute inset-0 flex flex-col justify-center p-16 text-white">
                    <h1 className="text-5xl font-bold mb-4">Get Started</h1>
                    <p className="text-xl opacity-90">Join thousands of teams who use Trellio to manage their projects.</p>
                </div>
            </div>
        </div>
    );
}