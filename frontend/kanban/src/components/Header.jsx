import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { RxExit } from "react-icons/rx";
import { CiBellOn } from "react-icons/ci";

export function Header() {
    const username = localStorage.getItem("username") || localStorage.getItem("user");
    const [logOut, setLogOut] = useState(false);

    function exit() {
        setLogOut(true);
        window.location.href = "/";
        localStorage.clear();
    }
    
    return (
        <header className="bg-white border-b border-gray-200 py-3">
            <div className="flex max-w-7xl mx-auto justify-between items-center h-full ">
                <div className="relative w-full max-w-md">
                    <input
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
                        <CiBellOn size={22}/>
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