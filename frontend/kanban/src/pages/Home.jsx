import { useState, useEffect } from "react";
import { GrFormAdd } from "react-icons/gr";
import { RxDoubleArrowLeft } from "react-icons/rx";
import { Projects } from "../components/Projects";
import { Aside } from "../components/aside";
import { Header } from "../components/Header";
import { Form } from "../components/Form";

export function Home() {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [qnt, setQnt] = useState(9);
  const token = localStorage.getItem("token");
  const [logOut, setLogOut] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [reloadProjects, setReloadProjects] = useState(0);

  const [favorite, setFavorite] = useState({
    favorite: false,
  });

  const isLogged = localStorage.getItem("isLogged");

  const [formData, setFormData] = useState({
    name: "",
    members: [],
  });

  function exit() {
    setLogOut(true);
    window.location.href = "/";
    localStorage.clear();
  }

  async function handleFavorite(id) {
    // To fix it
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
      await fetch(`http://localhost:8000/projects/${id}`, {
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
      setShowProjectForm(false)
      setFormData({ name: "", members: [] });
      setReloadProjects(prevReloadProjects => prevReloadProjects + 1)
    }
    console.log(body)
  }

  function sumQnt() {
    if (qnt <= projects.length) {
      setQnt(qnt + 6);
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
  }, [qnt, isLogged, token, reloadProjects]);

  return (
    <div
      className={`min-h-screen grid ${showSidebar ? "grid-cols-[250px_1fr]" : "grid-cols-[0px_1fr]"
        } 
    grid-rows-[70px_1fr_1fr] bg-gray-100`}
    >
      <Aside
        projects={projects}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
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
      <Header />

      {/* Main content */}
      <main className="row-span-2 bg-gray-50 p-6 overflow-y-auto space-y-7">
        {/* Modal */}
        {showProjectForm && (
          <Form
            toCreate='Project'
            fields={[
              {
                label: "Project name",
                htmlFor: "project",
                onChange: handleChangeName,
              },
              {
                label: "Members",
                htmlFor: "members",
                onChange: handleChangeMembers,
              },
            ]}
            handleSubmit={handleSubmit}
            setShowForm={setShowProjectForm}
          />
        )}

        <div className="max-w-8xl mx-auto">
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

          <Projects
            projects={projects}
            members={members}
            handleFavorite={handleFavorite}
          />


        </div>
        <div className="text-sm text-gray-600 mb-2 text-right">
          Showing <span className="font-semibold text-gray-800">{projects.length}</span> project{projects.length !== 1 && 's'}
        </div>


        <p
          className="cursor-pointer underline font-light w-20 text-center mx-auto"
          onClick={sumQnt}
        >
          {qnt <= projects.length ? "Show More" : ''}
        </p>
      </main>
    </div>
  );
}