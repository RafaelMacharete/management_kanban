import { useState } from "react"
import { Link } from "react-router-dom"

export function Register() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''

    })

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const response = await fetch('http://127.0.0.1:8000/createuser/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        const body = await response.json()
        alert(body)
    }

    return (
        <div className='flex justify-center items-center min-h-screen'>
            <form
                className="bg-white p-6 rounded-2xl shadow-indigo-500 shadow-lg w-80"
                onChange={handleChange}
                onSubmit={handleSubmit}
                method='POST' // Esconde os campos do formulário
            >
                <h2
                    className="text-2xl font-semibold text-[#5030E5] text-center mb-4"
                >
                    Register
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
                    <Link to="/"
                        className="text-[#5030E5] text-sm hover:underline"
                    >
                        Login
                    </Link>
                </div>
                <button
                    type="submit"
                    className="w-full bg-[#5030E5] text-white py-2 rounded-lg hover:bg-[#4025b8] transition">
                    Register
                </button>
            </form>
        </div>
    )
}