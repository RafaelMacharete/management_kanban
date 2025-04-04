import { Navbar } from '../components/Navbar'
import { Link } from 'react-router-dom';
import { useState } from 'react';

export function Login() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        fetch('http://127.0.0.1:8000/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.Error) {
                    alert(data.Error)
                    console.log(data.Error)
                } else {
                    alert('Sucessfuly logged')
                }
            })
    }

    return (
        <>
            <div
                className="flex items-center justify-center min-h-screen">
                <form
                    className="bg-white p-6 rounded-2xl shadow-indigo-500 shadow-lg w-80"
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    method='POST' // Esconde os campos do formulário
                >
                    <h2
                        className="text-2xl font-semibold text-[#5030E5] text-center mb-4"
                    >
                        Login
                    </h2>
                    <div
                        className="mb-4">
                        <label
                            htmlFor="username"
                            className="block text-[#787486] mb-1"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"

                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5030E5]"
                        />
                    </div>
                    <div
                        className="mb-4">
                        <label htmlFor="password"
                            className="block text-[#787486] mb-1"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"

                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5030E5]"
                        />
                    </div>
                    <div
                        className="flex justify-between items-center mb-4">
                        <Link to="/register"
                            className="text-[#5030E5] text-sm hover:underline"
                        >
                            Register
                        </Link>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#5030E5] text-white py-2 rounded-lg hover:bg-[#4025b8] transition">
                        Login
                    </button>
                </form>
            </div>
        </>
    );
}
