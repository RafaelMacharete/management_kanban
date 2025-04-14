import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Aside } from "../components/aside";
import { Header } from "../components/Header";
export function Project() {
    const location = useLocation();
    const { projectname } = location.state || {};
    const { projects } = location.state || {};
    const [showSidebar, setShowSidebar] = useState(true);

    return (
        <div className={`min-h-screen grid ${showSidebar ?
            "grid-cols-[250px_1fr]" : "grid-cols-[0px_1fr]"} 
            grid-rows-[70px_1fr_1fr] bg-gray-100`}
        >
            <Aside showSidebar={showSidebar} projects={projects} />

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

            <div>
                <p>{projectname}</p>
            </div>
        </div>

    );
}
