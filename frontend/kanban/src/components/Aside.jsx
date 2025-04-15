import { FiTrello } from "react-icons/fi";
import { RxDoubleArrowLeft } from "react-icons/rx";
import { PiSquaresFourLight } from "react-icons/pi";
import { Link } from "react-router-dom";

export function Aside({ projects, showSidebar, setShowSidebar}) {

    return (
        // Left Bar
        <aside
            className={`row-span-3 grid grid-rows-[70px_1fr_1fr] bg-white border-r border-gray-300 ${showSidebar ? "opacity-100" : "opacity-0"
                } `}
        >
            {/* Button to hide aside */}
            {showSidebar && (
                <div className="flex justify-between items-center  px-4 py-2 border-b border-gray-300">
                    <Link 
                        className="flex items-center gap-2"
                        to='/projects'
                        >
                        
                        <FiTrello size={30} className="text-violet-600" />
                        <h1 className="text-xl font-semibold text-gray-800">Trellio</h1>
                    </Link>
                    <button
                        onClick={() => setShowSidebar(!showSidebar)}
                        className="bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition"
                    >
                        <RxDoubleArrowLeft
                            size={20}
                            className="text-gray-600 hover:text-violet-600 transition"
                        />
                    </button>
                </div>
            )}

            {/* Links on aside*/}
            <div className="flex flex-col justify-start gap-4 p-4 text-gray-700">
                <div className="flex items-center gap-3 group">
                    <PiSquaresFourLight
                        size={26}
                        className="text-gray-500 group-hover:text-pink-600 transition duration-200"
                    />
                    <a
                        href="#"
                        className="text-base hover:text-pink-600 transition duration-200"
                    >
                        Home
                    </a>
                </div>
                <div className="flex items-center gap-3 group">
                    <PiSquaresFourLight
                        size={26}
                        className="text-gray-500 group-hover:text-pink-600 transition duration-200"
                    />
                    <a
                        href="#"
                        className="text-base hover:text-pink-600 transition duration-200"
                    >
                        Projects
                    </a>
                </div>
                <div className="flex items-center gap-3 group">
                    <PiSquaresFourLight
                        size={26}
                        className="text-gray-500 group-hover:text-pink-600 transition duration-200"
                    />
                    <a
                        href="#"
                        className="text-base hover:text-pink-600 transition duration-200"
                    >
                        Teams
                    </a>
                </div>
                <div className="flex items-center gap-3 group">
                    <PiSquaresFourLight
                        size={26}
                        className="text-gray-500 group-hover:text-pink-600 transition duration-200"
                    />
                    <a
                        href="#"
                        className="text-base hover:text-pink-600 transition duration-200"
                    >
                        Tasks
                    </a>
                </div>
                <div className="flex items-center gap-3 group">
                    <PiSquaresFourLight
                        size={26}
                        className="text-gray-500 group-hover:text-pink-600 transition duration-200"
                    />
                    <a
                        href="#"
                        className="text-base hover:text-pink-600 transition duration-200"
                    >
                        Settings
                    </a>
                </div>
            </div>

            {/* Exhibition of projects */}
            <div className="p-4 bg-white text-sm rounded-b-lg shadow">
                <div className="flex flex-col gap-4 p-2 border-t border-gray-200">
                    <b className="text-xl text-violet-700">Favorite Projects</b>

                    {/* Lista de projetos */}
                    <div className="h-67 overflow-y-scroll flex flex-col gap-2 border-2 border-gray-300 p-2">
                        {projects
                            .filter((project) => project.favorite === true)
                            .map((project) => (
                                <p key={project.id}>{project.name}</p>
                            ))}
                    </div>
                </div>
            </div>
        </aside>



    )
}
