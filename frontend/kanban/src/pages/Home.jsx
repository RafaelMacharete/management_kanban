import { useState, useEffect } from "react";
import { FiTrello } from "react-icons/fi";
import { PiSquaresFourLight } from "react-icons/pi";
import { RxDoubleArrowLeft } from "react-icons/rx";
import { CiSearch } from "react-icons/ci";
import { RxExit } from "react-icons/rx";
import { GrFormAdd } from "react-icons/gr";

export function Home() {
  const [projects, setProjects] = useState([]);
  const [projectsWithAccounts, setProjectsWithAccounts] = useState([]);
  const [logOut, setLogOut] = useState(false);
  const token = localStorage.getItem("token");
  const username =
    localStorage.getItem("username") || localStorage.getItem("user");
  const [showSidebar, setShowSidebar] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);

  const handleClickProjectForm = ((e) =>{
    setShowProjectForm(!showProjectForm)
  })

  useEffect(() => {
    if (!token) {
      window.location.href = "/";
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
  };

  return (
    <div
      className={`min-h-screen grid ${
        showSidebar ? "grid-cols-[250px_1fr]" : "grid-cols-[0px_1fr]"
      } grid-rows-[70px_1fr_1fr] bg-gray-100`}
    >
      <aside
        className={`row-span-3 grid grid-rows-[70px_1fr_1fr] bg-white border-r border-gray-300 ${
          showSidebar ? "opacity-100" : "opacity-0"
        } `}
      >
        {/* Trellio */}
        {showSidebar && (
          <div className="flex justify-between items-center  px-4 py-2 border-b border-gray-300">
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

        <div className="p-4 bg-white text-sm rounded-b-lg">
          <div className="flex gap-2 justify-between p-2 border-t">
            <b className="text-xl">my projects</b>
            <div className="absolute left-50">
              <button
                className="flex items-center rounded-xl border border-gray-300"
                onClick={handleClickProjectForm}
              >
                <GrFormAdd size={29} />
              </button>
              {showProjectForm && (
              <div className="relative left-14 border w-50 h-full">
                <p>asdas</p>
                <input type="text" placeholder="Project name"/>
                <input type="text" placeholder="Member's name"/>
              </div>
              )}
            </div>
          </div>
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

      <header className="bg-white px-15 border-b border-gray-300">
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

      <main className="row-span-2 bg-white">
        <div className="bg-gray-100 w-full h-full">
          <h1>Projects</h1>
          <GrFormAdd />
        </div>
      </main>
    </div>
  );
}
