import { useLocation } from "react-router-dom";

export function Project() {
    const location = useLocation();
    const { projectname } = location.state || {};

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800">Projeto: {projectname}</h1>
        </div>
    );
}
