import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { RxExit } from "react-icons/rx";
import { CiBellOn } from "react-icons/ci";

export function Header({ showSidebar, projectSearched, setProjectSearched }) {
    const username = localStorage.getItem("username") || localStorage.getItem("user");
    const [inputValue, setInputValue] = useState({ search: '' });
    const token = localStorage.getItem("token");

    function exit() {
        window.location.href = "/";
        localStorage.clear();
    }

    function handleInputChange(e) {
        e.preventDefault();
        setInputValue({ ...inputValue, search: e.target.value });
    }

    useEffect(() => {
        if (inputValue.search === '') {
            setProjectSearched([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            try {
                const response = await fetch('http://localhost:8000/projects/search/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(inputValue)
                });
                const body = await response.json();
                setProjectSearched(body); 
            } catch (error) {
                console.log(error);
            }
        }, 700);

        return () => clearTimeout(timeoutId);
    }, [inputValue, token, setProjectSearched]);

    return (
        <header className="bg-white border-b border-gray-200 py-3">
            <div className={`flex max-w-[1400px] ${!showSidebar && "px-10"} mx-auto justify-between items-center h-full `}>
                <div className="relative w-full max-w-md">
                    <input
                    onChange={handleInputChange}
                        type="text"
                        placeholder="Search for projects"
                        className="w-full bg-gray-50 h-9 px-4 pr-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 text-sm transition"
                    />
                    <button className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                        <CiSearch size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <button className="text-gray-500 hover:text-gray-700 p-1">
                        <CiBellOn size={22} />
                    </button>
                    <div className="text-sm font-medium text-gray-700">
                        {username}
                    </div>
                    <button
                        onClick={exit}
                        className="text-gray-500 hover:text-red-600 p-1 transition"
                        title="Logout"
                    >
                        <RxExit size={20} />
                    </button>
                </div>
            </div>
        </header>
    )
}