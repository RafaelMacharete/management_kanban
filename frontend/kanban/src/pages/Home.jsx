// Arrumar o modal não aparecer sem o aside, não ter que me auto-adicionar
// Mostra a quantidade de projetos exibidos
import { useState, useEffect } from "react";
import { FiTrello } from "react-icons/fi";
import { PiSquaresFourLight } from "react-icons/pi";
import { RxDoubleArrowLeft } from "react-icons/rx";
import { CiSearch } from "react-icons/ci";
import { RxExit } from "react-icons/rx";
import { GrFormAdd } from "react-icons/gr";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaObjectGroup, FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import { jwtDecode } from "jwt-decode";

export function Home() {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [logOut, setLogOut] = useState(false);
  const [qnt, setQnt] = useState(9);
  const token = localStorage.getItem("token");
  const username =
    localStorage.getItem("username") || localStorage.getItem("user");
  const [showSidebar, setShowSidebar] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [response, setResponse] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);

  const [favorite, setFavorite] = useState({
    favorite: false,
  });

  const isLogged = localStorage.getItem("isLogged");

  const [formData, setFormData] = useState({
    name: "",
    members: [],
  });

  const handleClickProjectForm = (e) => {
    setShowProjectForm(!showProjectForm);
  };

  if (!isLogged || !token) {
    window.location.href = "/";
    return null;
  }
  function handleChangeName(e) {
    setFormData({ ...formData, name: e.target.value });
  }

  function handleChangeMembers(e) {
    let membersInput = e.target.value.split(",");
    membersInput = membersInput.map((item) => Number(item));
    setFormData({ ...formData, members: membersInput });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/projectboards/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
    const body = await response.json();
    console.log(body);
    if (response.ok) {
      setResponse({ type: "success", message: "Project created sucessfully!" });
      setFormData({ name: "", members: [] });
    } else {
      setResponse({
        type: "error",
        message: body.detail || "Error on create project .",
      });
    }

    setTimeout(() => setResponse(null), 4000);
  }

  async function handleFavorite(id) {
    const updatedProjects = projects.map((project) => {
      if (project.id === id) {
        return { ...project, favorite: !project.favorite };
      }
      return project;
    });
    setProjects(updatedProjects);

    const updatedProject = updatedProjects.find((project) => project.id === id);
    const newFavorite = { favorite: updatedProject.favorite };

    try {
      await fetch(`http://localhost:8000/projectboards/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newFavorite),
      });
    } catch (error) {
      console.error(error);
    }
  }

  function exit() {
    setLogOut(true);
    window.location.href = "/";
    localStorage.clear();
  }

  function sumQnt() {
    if (qnt <= projects.length) {
      setQnt(qnt + 3);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        if (!isLogged || !token) return; // Não faz nada se não estiver logado

        const response = await fetch(`http://localhost:8000/jwt/?qnt=${qnt}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          setUnauthorized(true); // Só cai aqui se estiver logado
          return;
        }

        const body = await response.json();
        setProjects(body.projects);
        setMembers(body.members);
      } catch (error) {
        console.error("Error while authenticating:", error);
      }
    }

    fetchData();
  }, [qnt, isLogged, token]);
  return (
    <div
      className={`min-h-screen grid ${
        showSidebar ? "grid-cols-[250px_1fr]" : "grid-cols-[0px_1fr]"
      } 
    grid-rows-[70px_1fr_1fr] bg-gray-100`}
    >
      {/* Left Bar */}
      <aside
        className={`row-span-3 grid grid-rows-[70px_1fr_1fr] bg-white border-r border-gray-300 ${
          showSidebar ? "opacity-100" : "opacity-0"
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

            {/* Floating button to open modal form */}
            <div className="relative self-end">
              <button
                className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-200 transition"
                onClick={handleClickProjectForm}
                title="Add Project"
              >
                <GrFormAdd size={24} />
              </button>
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

      {unauthorized && isLogged && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow-xl text-center animate-fade-in">
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Session Expired
            </h2>
            <p className="text-gray-700 mb-4">
              Your session has expired. Please log in again to continue.
            </p>
            <button
              onClick={exit}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}

      {/* Main header*/}
      <header className="bg-white border-b border-gray-300">
        <div className="flex max-w-6xl mx-auto justify-between items-center h-full">
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
            <p>
              <span className="text-xl text-cyan-700 underline">
                {username}
              </span>
            </p>
            <RxExit
              onClick={exit}
              className="cursor-pointer text-gray-500 hover:text-red-600 transition"
              size={24}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="row-span-2 bg-gray-50 p-6 overflow-y-auto space-y-7">
        {/* Modal */}
        {showProjectForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-2">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative animate-fade-in">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
                onClick={() => setShowProjectForm(false)}
              >
                <IoIosCloseCircleOutline size={28} />
              </button>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Create Project
              </h2>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {response && (
                  <div
                    className={`p-3 rounded-lg text-sm font-medium ${
                      response.type === "success"
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-red-100 text-red-700 border border-red-300"
                    }`}
                  >
                    {response.message}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="project"
                    className="block text-sm font-medium text-violet-700"
                  >
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
                  <label
                    htmlFor="members"
                    className="block text-sm font-medium text-violet-700"
                  >
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
                  className="w-full bg-violet-500 text-white py-2 rounded-lg hover:bg-violet-600 transition"
                >
                  Create
                </button>
              </form>
            </div>
          </div>
        )}

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Project */}
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white p-4 rounded-xl shadow border border-violet-400 hover:shadow-md transition"
              >
                <div className="flex justify-between">
                  <h2 className="text-lg font-semibold text-gray-700">
                    {project.name}
                  </h2>

                  <button
                    key={project.id}
                    onClick={() => handleFavorite(project.id)}
                    className="transition-transform duration-200 ease-in-out transform hover:scale-110 cursor-pointer"
                  >
                    {project.favorite ? (
                      <FaStar
                        size={23}
                        className="text-cyan-700 transition-colors duration-300"
                        title="Remove from favorites"
                      />
                    ) : (
                      <FaRegStar
                        size={20}
                        className="text-gray-500 transition-colors duration-300 hover:text-cyan-700"
                        title="Add to favorites"
                      />
                    )}
                  </button>
                </div>

                {members
                  .filter((member) => project.members.includes(member.id))
                  .map((member) => (
                    <p key={member.id} className="text-sm text-gray-500 mt-1">
                      {member.username}
                    </p>
                  ))}
              </div>
            ))}
          </div>
        </div>
        <p
          className="text-center cursor-pointer underline font-light"
          onClick={sumQnt}
        >
          Show More
        </p>
      </main>
    </div>
  );
}
