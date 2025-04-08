import { useState, useEffect } from "react";
import { FiTrello } from "react-icons/fi";
import { PiSquaresFourLight } from "react-icons/pi";
import { RxDoubleArrowLeft } from "react-icons/rx";
import { CiSearch } from "react-icons/ci";
import { RxExit } from "react-icons/rx";

export function Home() {
  const [projects, setProjects] = useState([]);
  const [projectsWithAccounts, setProjectsWithAccounts] = useState([]);
  const [logOut, setLogOut] = useState(false)
  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username') || localStorage.getItem('user');
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    if (!token) {
      window.location.href = '/'
    }
    async function fetchProjects() {
      try {
        const res = await fetch("http://127.0.0.1:8000/projectboards/");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Erro ao buscar projetos:", err);
      }
    }
    fetchProjects();
  }, [logOut]);

  const exit = () => {
    localStorage.clear();
    setLogOut(true);
  }

  return (
    <div className={`min-h-screen grid ${showSidebar ? 'grid-cols-[250px_1fr]' : 'grid-cols-[0px_1fr]'} grid-rows-[70px_1fr_1fr] bg-gray-100 transition-all duration-300`}>

      <aside className={`row-span-3 grid grid-rows-[70px_1fr_1fr] bg-white shadow-lg transition-all duration-300 ${showSidebar ? 'opacity-100' : 'opacity-0'}`}>

        {/* Trellio */}


        {showSidebar && (
          <div className="flex justify-between items-center border-b border-gray-300 px-4 py-2">
            <div className="flex items-center gap-2">
              <FiTrello size={36} className="text-violet-600" />
              <h1 className="text-2xl font-bold text-gray-800">Trellio</h1>
            </div>
            <RxDoubleArrowLeft
              onClick={() => setShowSidebar(false)}
              size={22}
              className="text-gray-500 hover:text-violet-600 transition-colors duration-200 cursor-pointer"
            />
          </div>
        )}

        {/* Links */}
        <div className="flex flex-col justify-start gap-4 p-4 text-gray-700">
          <div className="flex items-center gap-3 group">
            <PiSquaresFourLight size={26} className="text-gray-500 group-hover:text-pink-600 transition duration-200" />
            <a href="#" className="text-base hover:text-pink-600 transition duration-200">Home</a>
          </div>
          <div className="flex items-center gap-3 group">
            <PiSquaresFourLight size={26} className="text-gray-500 group-hover:text-pink-600 transition duration-200" />
            <a href="#" className="text-base hover:text-pink-600 transition duration-200">Projects</a>
          </div>
          <div className="flex items-center gap-3 group">
            <PiSquaresFourLight size={26} className="text-gray-500 group-hover:text-pink-600 transition duration-200" />
            <a href="#" className="text-base hover:text-pink-600 transition duration-200">Teams</a>
          </div>
          <div className="flex items-center gap-3 group">
            <PiSquaresFourLight size={26} className="text-gray-500 group-hover:text-pink-600 transition duration-200" />
            <a href="#" className="text-base hover:text-pink-600 transition duration-200">Tasks</a>
          </div>
          <div className="flex items-center gap-3 group">
            <PiSquaresFourLight size={26} className="text-gray-500 group-hover:text-pink-600 transition duration-200" />
            <a href="#" className="text-base hover:text-pink-600 transition duration-200">Settings</a>
          </div>
        </div>


        {/* Extra content */}
        <div className="p-4 bg-[#5030E5] text-sm rounded-b-lg">
          <p>Conteúdo adicional</p>
        </div>
      </aside>

      {!showSidebar && (
        <button
          onClick={() => setShowSidebar(true)}
          className="absolute top-4 left-2 z-50 bg-white border border-gray-300 rounded-full p-2 shadow-md hover:bg-gray-100 transition"
        >
          <RxDoubleArrowLeft
            size={20}
            className="rotate-180 text-gray-600 hover:text-violet-600 transition"
          />
        </button>
      )}

      <header className="bg-white shadow-md px-15">
        <div className="flex justify-between items-center h-full">
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

          <div className="flex items-center gap-3 text-gray-700 font-medium">
            <p>Username: {username}</p>
            <RxExit
              onClick={exit}
              className="cursor-pointer text-gray-500 hover:text-red-600 transition"
              size={24}
            />
          </div>
        </div>
      </header>

      <main className="row-span-2 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsWithAccounts.map((project) => (
            <div key={project.id} className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition duration-200">
              <h2 className="text-xl font-semibold mb-2 text-violet-700">{project.name}</h2>
              <h3 className="text-lg font-medium text-gray-700 mb-1">Usuários:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {project.accounts.length > 0 ? (
                  project.accounts.map((user) => (
                    <li key={user.id} className="text-gray-600">{user.username}</li>
                  ))
                ) : (
                  <li className="text-gray-400 italic">Nenhum usuário associado</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );

}
