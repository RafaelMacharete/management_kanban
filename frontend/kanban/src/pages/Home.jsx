import { useState, useEffect } from "react";
import { FiTrello } from "react-icons/fi";
import { PiSquaresFourLight } from "react-icons/pi";
import { RxDoubleArrowLeft } from "react-icons/rx";
import { CiSearch } from "react-icons/ci";
import { RxExit } from "react-icons/rx";
import { GrFormAdd } from "react-icons/gr";
import { IoIosCloseCircleOutline } from "react-icons/io";

export function Home() {
  const [projects, setProjects] = useState([]);
  const [projectsWithAccounts, setProjectsWithAccounts] = useState([]);
  const [logOut, setLogOut] = useState(false);
  const token = localStorage.getItem("token");
  const username =
    localStorage.getItem("username") || localStorage.getItem("user");
  const [showSidebar, setShowSidebar] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [response, setResponse] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    members: [],
  })

  const handleClickProjectForm = ((e) => {
    setShowProjectForm(!showProjectForm)
  })

  function handleChangeName(e) {
    setFormData({ ...formData, name: e.target.value })
  }

  function handleChangeMembers(e) {
    let membersInput = e.target.value.split(',')
    membersInput = membersInput.map((item) => Number(item))
    setFormData({ ...formData, members: membersInput })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const response = await fetch("http://localhost:8000/projectboards/", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData),
    });
    const body = await response.json();
    if (response.ok) {
      setResponse({ type: 'success', message: 'Project created sucessfully!' });
      setFormData({ name: '', members: [] });
    } else {
      setResponse({ type: 'error', message: body.detail || 'Error on create project .' });
    }

    setTimeout(() => setResponse(null), 4000);
  }

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
    <div className={`min-h-screen grid ${showSidebar ? "grid-cols-[250px_1fr]" : "grid-cols-[0px_1fr]"} 
    grid-rows-[70px_1fr_1fr] bg-gray-100`}
    >
      {/* Left Bar */}
      <aside
        className={`row-span-3 grid grid-rows-[70px_1fr_1fr] bg-white border-r border-gray-300 ${showSidebar ? "opacity-100" : "opacity-0"
          } `}
      >
        {/* Button to hide aside */}
        {showSidebar && (
          <div className="flex justify-between items-center  px-4 py-2 border-b border-gray-300">
            <div className="flex items-center gap-2">
              <FiTrello size={30} className="text-violet-600" />
              <h1 className="text-xl font-semibold text-gray-800">Trellio</h1>
            </div>
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
        <div className="p-4 bg-white text-sm rounded-b-lg">
          <div className="flex gap-2 justify-between p-2 border-t">
            <b className="text-xl">my projects</b>

            {/* Button to open the project modal form */}
            <div className="absolute left-50">
              <button
                className="flex items-center rounded-xl border border-gray-300 cursor-pointer hover:bg-gray-200"
                onClick={handleClickProjectForm}
              >
                <GrFormAdd size={29} />
              </button>

              {/* Modal form project */}
              {showProjectForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1">
                  <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
                    <button
                      className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                      onClick={() => setShowProjectForm(false)}
                    >
                      <IoIosCloseCircleOutline size={24} />
                    </button>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create Project</h2>

                    {/* Form with message of sucessful and unsucessful */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      {response && (
                        <div
                          className={`p-3 mb-2 rounded-lg text-sm font-medium ${response.type === 'success'
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-red-100 text-red-700 border border-red-300'
                            }`}
                        >
                          {response.message}
                        </div>
                      )}

                      <div>
                        <label htmlFor="project" className="block text-sm font-medium text-violet-700">
                          Project's Title
                        </label>
                        <input
                          type="text"
                          id="project"
                          className="mt-1 w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                          onChange={handleChangeName}
                        />
                      </div>

                      <div>
                        <label htmlFor="members" className="block text-sm font-medium text-violet-700">
                          Members Name
                        </label>
                        <input
                          type="text"
                          id="members"
                          className="mt-1 w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                          onChange={handleChangeMembers}
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full cursor-pointer bg-violet-500 text-white py-2 rounded-lg hover:bg-violet-600 transition"
                      >
                        Create
                      </button>
                    </form>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </aside>

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

      {/* Main header (search input and username) */}
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

          {/* User content */}
          <div className="flex items-center gap-3 text-gray-700 font-medium">
          <p>Username: <span className="text-xl text-cyan-700 underline">{username}</span></p>
            <RxExit
              onClick={exit}
              className="cursor-pointer text-gray-500 hover:text-red-600 transition"
              size={24}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="row-span-2 bg-gray-50 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">My Projects</h1>
            <button
              onClick={handleClickProjectForm}
              className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition"
            >
              <GrFormAdd size={20} />
              <span>Create Project</span>
            </button>
          </div>

          {/* Área onde você pode exibir os cards de projetos futuramente */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Project */}
            <div className="bg-white p-4 rounded-xl shadow border border-violet-400 hover:shadow-md transition">
              <h2 className="text-lg font-semibold text-gray-700">Project Name</h2>
              <p className="text-sm text-gray-500 mt-1">Team Members: Alice, Bob</p>
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}
