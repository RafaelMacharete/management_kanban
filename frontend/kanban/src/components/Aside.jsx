import { FiTrello } from "react-icons/fi";
import { RxDoubleArrowLeft } from "react-icons/rx";
import { PiSquaresFourLight } from "react-icons/pi";
import { Link } from "react-router-dom";

export function Aside({ projects, showSidebar, setShowSidebar }) {
    return (
        <aside
            className={`fixed md:relative h-screen md:h-auto row-span-3 bg-white border-r border-gray-200 transition-all duration-300 ${
                showSidebar ? "w-64 opacity-100" : "w-0 md:w-16 opacity-0 md:opacity-100"
            }`}
        >
            <div className="h-full flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                    {showSidebar ? (
                        <Link 
                            className="flex items-center gap-2"
                            to='/projects'
                        >
                            <FiTrello size={24} className="text-violet-600" />
                            <h1 className="text-lg font-medium text-gray-800">Trellio</h1>
                        </Link>
                    ) : (
                        <Link to='/projects' className="p-2">
                            <FiTrello size={24} className="text-violet-600" />
                        </Link>
                    )}
                    <button
                        onClick={() => setShowSidebar(!showSidebar)}
                        className="hidden md:flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition"
                    >
                        <RxDoubleArrowLeft
                            size={18}
                            className="text-gray-500"
                        />
                    </button>
                </div>

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
                                className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50 hover:text-violet-600 transition"
                            >
                                <span className="text-gray-500">{item.icon}</span>
                                {showSidebar && <span>{item.label}</span>}
                            </a>
                        ))}
                    </div>

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
                                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-50 transition truncate"
                                    >
                                        <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                                        {showSidebar && <span>{project.name}</span>}
                                    </a>
                                ))}
                        </div>
                    </div>
                </nav>
            </div>
        </aside>
    );
}