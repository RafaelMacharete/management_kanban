// Arrumar o modal não aparecer sem o aside, não ter que me auto-adicionar
// Mostra a quantidade de projetos exibidos
import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { RxExit } from "react-icons/rx";
import { GrFormAdd } from "react-icons/gr";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Projects } from "../components/Project";
import { Aside } from "../components/aside";

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
    const response = await fetch("http://localhost:8000/projects/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
    const body = await response.json();
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
        if (!isLogged || !token) return;

        const response = await fetch(`http://localhost:8000/jwt/?qnt=${qnt}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 401) {
          setUnauthorized(true);
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
      className={`min-h-screen grid ${showSidebar ? "grid-cols-[250px_1fr]" : "grid-cols-[0px_1fr]"
        } 
    grid-rows-[70px_1fr_1fr] bg-gray-100`}
    >
      <Aside showSidebar={showSidebar} projects={projects}/>
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
                    className={`p-3 rounded-lg text-sm font-medium ${response.type === "success"
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

          <Projects projects={projects} members={members}/>
          
        </div>
        <p
          className="cursor-pointer underline font-light w-20 text-center mx-auto"
          onClick={sumQnt}
        >
          {qnt <= projects.length ? "Show More": ''}
        </p>
      </main>
    </div>
  );
}