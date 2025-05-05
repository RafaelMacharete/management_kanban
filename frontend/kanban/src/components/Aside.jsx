import { FiTrello } from "react-icons/fi";
import { RxDoubleArrowLeft } from "react-icons/rx";
import { PiSquaresFourLight } from "react-icons/pi";
import { Link } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import aa from '../assets/logo.png'
export function Aside({ projects, showSidebar, setShowSidebar }) {

    return (
        // Left Bar
        <aside
            className={`row-span-3 grid grid-rows-[70px_1fr_1fr] bg-white border-r border-gray-300 ${showSidebar ? "opacity-100" : "opacity-0"
                } `}
        >
            {/* Button to hide aside */}
            {showSidebar && (
                <div className="flex justify-between items-center px-4 py-2 border-b border-gray-300">
                    <Link
                        className="flex items-center gap-2"
                        to='/projects'
                    >

                        <img src={aa} alt="trellio logo" width={120}/>
                    </Link>
                    <button
                        onClick={() => setShowSidebar(!showSidebar)}
                        className="hidden md:flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition cursor-pointer"
                    >
                        <RxDoubleArrowLeft
                            size={18}
                            className="text-gray-500"
                        />
                    </button>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
                <div className="space-y-1 px-2">
                    {[
                        { icon: <PiSquaresFourLight size={20} />, label: "Home" },
                        { icon: <PiSquaresFourLight size={20} />, label: "Projects" },
                        { icon: <PiSquaresFourLight size={20} />, label: "Teams" },
                        { icon: <PiSquaresFourLight size={20} />, label: "Tasks" },
                        { icon: <PiSquaresFourLight size={20} />, label: "Settings" }
                    ].map((item, index) => (
                        <a
                            key={index}
                            href="#"
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-violet-600 transition"
                        >
                            <span className="text-gray-500">{item.icon}</span>
                            {showSidebar && <span>{item.label}</span>}
                        </a>
                    ))}
                </div>


            </nav>

            {/* Projects section */}
            <div className="mt-8 px-4">
                {showSidebar && (
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Favorite Projects
                    </h3>
                )}
                <div className="space-y-1">
                    {projects
                        .filter((project) => project.favorite)
                        .map((project) => (
                            <a
                                key={project.id}
                                href="#"
                                className="flex items-center text-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-200"
                            >
                                <span className="text-yellow-400"><FaStar></FaStar></span>
                                {showSidebar && <span>{project.name}</span>}
                            </a>
                        ))}
                </div>
            </div>
        </aside>
    )
}
