import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Aside } from "../components/aside";
import { Header } from "../components/Header";
import { RxDoubleArrowLeft } from "react-icons/rx";
import { FaPen } from "react-icons/fa";
import { CiGrid2H, CiGrid41 } from "react-icons/ci";

export function Project() {
    const location = useLocation();
    const { projectid } = location.state || {};
    const { projectname } = location.state || {};
    const { projects } = location.state || {};

    const [showSidebar, setShowSidebar] = useState(true);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [activeFilter, setActiveFilter] = useState("Today");
    
    const filterOptions = ["Today", "This Week", "This Month", "All"];
    const columnData = { "project_board": projectid }
    
    const [columns, setColumns] = useState([])
    const [cards, setCards] = useState([])
    const aa = {'columns_id': [1,2,3]}
    
    // cards.map((card) => console.log(card))
    
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`http://localhost:8000/column/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(columnData)
                })
                const body = await response.json();
                setColumns(body)
            } catch (error) {
                console.log('error: ', error);
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`http://localhost:8000/card/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(aa)
                })
                const body = await response.json();
                setCards(body)

            } catch (error) {
                console.log('error: ', error);
            }
        }
        fetchData()
    }, [columns])

    return (
        <div className={`min-h-screen grid ${showSidebar ? "grid-cols-[250px_1fr]" : "grid-cols-[0px_1fr]"} grid-rows-[70px_1fr_1fr] bg-gray-100`}>
            <Aside
                projects={projects}
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
                showProjectForm={showProjectForm}
                setShowProjectForm={setShowProjectForm}
            />

            {!showSidebar && (
                <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="absolute top-4 left-2 z-50 bg-white border border-gray-300 rounded-full p-2 shadow-md hover:bg-gray-100 transition"
                >
                    <RxDoubleArrowLeft
                        size={20}
                        className="rotate-180 text-gray-600 hover:text-violet-600 transition"
                    />
                </button>
            )}

            <Header />

            <main className="row-span-2 bg-gray-50 p-6 overflow-y-auto space-y-6">
                <div className="max-w-6xl mx-auto space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-gray-800">
                            <h1 className="text-2xl font-bold">{projectname}</h1>
                            <FaPen className="text-gray-500 hover:text-violet-600 transition cursor-pointer" />
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-300 shadow-sm">
                                {filterOptions.map((option) => (
                                    <button
                                        key={option}
                                        className={`px-3 py-1 text-sm font-medium rounded-md transition ${activeFilter === option
                                            ? "bg-violet-500 text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                        onClick={() => setActiveFilter(option)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-2 text-gray-600 cursor-pointer">
                                <CiGrid2H size={24} className="hover:text-violet-600 transition" />
                                <CiGrid41 size={24} className="hover:text-violet-600 transition" />
                            </div>
                        </div>
                    </div>

                    {/* Project content based on activeFilter */}
                    <div className="p-4 bg-white rounded-xl shadow-sm text-center text-gray-500">
                        <p className="text-sm">Showing tasks for: <span className="font-semibold text-gray-800">{activeFilter}</span></p>
                    </div>
                    <div className="flex justify-between">
                        {columns.map((column) => (
                            <div className="bg-gray-300 w-78">
                                <h1 className="text-center">{column.name}</h1>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
