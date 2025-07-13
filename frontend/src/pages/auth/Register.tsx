import { useState, type ChangeEvent, type FormEvent } from "react";
import { Navigate, Link } from "react-router-dom";

interface IFormData {
    username: string;
    password: string;
    email: string;
    nickname: string;
    profile_image: File | string;
    role: string;
}

export function Register() {
    const [formData, setFormData] = useState<IFormData>({
        username: '',
        password: '',
        email: '',
        nickname: '',
        profile_image: '',
        role: ''
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isRegistered, setIsRegistered] = useState<boolean>(false);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value, files, type } = e.target;

        if (type === "file" && files && files.length > 0) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        const form = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (value !== '') {
                // If field be 'profile_image' and also a File, add as a file
                if (key === 'profile_image' && value instanceof File) {
                    form.append(key, value);
                } else {
                    form.append(key, String(value));
                }
            }
        });

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