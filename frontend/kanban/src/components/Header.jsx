import { CiSearch } from "react-icons/ci";
import { RxExit } from "react-icons/rx";

export function Header() {
    const username =
        localStorage.getItem("username") || localStorage.getItem("user");
        
    function exit() {
        setLogOut(true);
        window.location.href = "/";
        localStorage.clear();
    }
    return (
        <header className="bg-white border-b border-gray-300">
            <div className="flex max-w-6xl mx-auto justify-between items-center h-full">
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Search for a task"
                        className="w-full bg-white h-10 px-4 pr-12 rounded-xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                    />
                    <button className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-violet-600 transition">
                        <CiSearch size={24} />
                    </button>
                </div>

                {/* User content */}
                <div className="flex items-center gap-3 text-gray-700 font-medium">
                    <p>
                        <span className="text-xl text-cyan-700 underline">
                            {username}
                        </span>
                    </p>
                    <RxExit
                        onClick={exit}
                        className="cursor-pointer text-gray-500 hover:text-red-600 transition"
                        size={24}
                    />
                </div>
            </div>
        </header>
    )
}