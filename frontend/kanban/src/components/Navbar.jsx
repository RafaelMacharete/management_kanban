import { Link } from "react-router-dom";
import { useState } from "react";
import { ProjectForm } from "./Forms/ProjectForm";
import { ColumnForm } from "./Forms/ColumnForm";
import { CardForm } from "./Forms/CardForm";

export function Navbar() {
    const [dropdown, setDropdown] = useState(false);
    const [activeTab, setActiveTab] = useState(null);

    const handleClick = () => {
        setDropdown(!dropdown);
    };

    return (
        <nav className="text-black p-4 shadow-lg bg-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-semibold">MeuSite</Link>
                <ul className="flex space-x-6 items-center">
                    <li>
                        <Link to="/" className="hover:text-[#787486] transition">Home</Link>
                    </li>
                    <li>
                        <Link to="/projects" className="bg-white text-[#5030E5] px-4 py-2 rounded-lg hover:bg-[#ddd] transition">Projects</Link>
                    </li>
                    <li className="relative">
                        <button onClick={handleClick} className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
                            Menu
                        </button>
                        {dropdown && (
                            <ul className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
                                <li>
                                    <button onClick={() => setActiveTab("project")} className="block px-4 py-2 w-full text-left hover:bg-gray-100">Criar Projeto</button>
                                </li>
                                <li>
                                    <button onClick={() => setActiveTab("column")} className="block px-4 py-2 w-full text-left hover:bg-gray-100">Criar Coluna</button>
                                </li>
                                <li>
                                    <button onClick={() => setActiveTab("card")} className="block px-4 py-2 w-full text-left hover:bg-gray-100">Criar Card</button>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>

            {/* Exibição do formulário com base na seleção */}
            <div className="container mt-4">
                {activeTab === "project" && <ProjectForm />}
                {activeTab === "column" && <ColumnForm />}
                {activeTab === "card" && <CardForm />}
            </div>
        </nav>
    );
}
