import { useState, useEffect } from "react";
import { GrFormAdd } from "react-icons/gr";
import { RxDoubleArrowLeft } from "react-icons/rx";
import { Projects } from "../components/Projects";
import { Aside } from "../components/aside";
import { Header } from "../components/Header";
import { FormProject } from "../components/FormProject";

export function Home() {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [qnt, setQnt] = useState(9);
  const token = localStorage.getItem("token");
  const [showSidebar, setShowSidebar] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [reloadProjects, setReloadProjects] = useState(0);
  const [allAccounts, setAllAccounts] = useState([]);
  const [membersInput, setMembersInput] = useState([]);
  const [addedAccounts, setAddedAccounts] = useState([]);
  const [formError, setFormError] = useState(null);

  const isLogged = localStorage.getItem("isLogged");

  const [formData, setFormData] = useState({
    name: "",
    members: [],
  });


  function exit() {
    window.location.href = "/";
    localStorage.clear();
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
    setFormError(null);
    if (!showProjectForm) {
      setFormData({ name: "", members: [] });
      setAddedAccounts([]);
      setAllAccounts([]);
      setMembersInput("");
    }
  };

  if (!isLogged || !token) {
    window.location.href = "/";
    return null;
  }

  function handleChangeName(e) {
    setFormData({ ...formData, name: e.target.value });
  }

  function handleChangeMembers(e) {
    let membersInput = e.target.value;
    setMembersInput(membersInput);
  }

  useEffect(() => {
    if (membersInput.length <= 0) {
      setAllAccounts([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch("http://localhost:8000/accounts/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ search: membersInput }),
        });
        if (response.status === 401) {
          setUnauthorized(true);
          return;
        }
        const body = await response.json();
        setAllAccounts(body);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    }, 700);

    return () => clearTimeout(timeoutId);
  }, [membersInput]);

  function addMember(accountId) {
    if (!formData.members.includes(accountId)) {
      const account = allAccounts.find((acc) => acc.id === accountId);
      if (!account) return;

      setFormData((prev) => ({ ...prev, members: [...prev.members, accountId] }));

      setAddedAccounts((prev) => [...prev, account]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError("Project name is required");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/projects/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create project");
      }

      setShowProjectForm(false);
      setFormData({ name: "", members: [] });
      setAddedAccounts([]);
      setAllAccounts([]);
      setMembersInput("");
      setReloadProjects(prev => prev + 1);
    } catch (error) {
      setFormError(error.message);
    }
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
          className="absolute top-4 left-2 z-10 p-2 hover:bg-gray-100 cursor-pointer"
        >
          <RxDoubleArrowLeft
            size={20}
            className="rotate-180 text-gray-600 hover:text-violet-600 transition"
          />
        </button>
      )}

      {unauthorized && isLogged && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white w-full max-w-xs p-5 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-medium mb-3">Session Expired</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Please log in again to continue.
            </p>
            <div className="border-t border-gray-100 pt-3">
              <button
                onClick={exit}
                className="text-blue-500 font-medium text-sm w-full py-2 hover:bg-gray-50 cursor-pointer"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main header*/}
      <Header showSidebar={showSidebar} />

      {/* Main content */}
      <main className="row-span-2 bg-gray-50 p-6 overflow-y-auto space-y-7">
        {/* Modal */}
        {showProjectForm && (
          <FormProject
            toCreate="Project"
            fields={[
              {
                label: "Project name",
                htmlFor: "project",
                placeholder: "Project name",
                onChange: handleChangeName,
              },
              {
                label: "Members",
                htmlFor: "members",
                placeholder: "Search for accounts name",
                onChange: handleChangeMembers,
              },
            ]}
            formDataSetter={setFormData}
            formData={formData}
            handleSubmit={handleSubmit}
            setShowForm={setShowProjectForm}
            allAccounts={allAccounts}
            addMember={addMember}
            addedAccounts={addedAccounts}
            setAddedAccounts={setAddedAccounts}
            formError={formError}
            isHome={true}
          />
        )}

        <div className={`max-w-[1400px] mx-auto ${!showSidebar && "px-4"}`}>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">My Projects</h1>
            <button
              onClick={handleClickProjectForm}
              className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-violet-500 text-white hover:bg-violet-600"
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
          Showing{" "}
          <span className="font-semibold text-gray-800">{projects.length}</span>{" "}
          project{projects.length !== 1 && "s"}
        </div>

        <p
          className="cursor-pointer underline font-light w-20 text-center mx-auto"
          onClick={sumQnt}
        >
          {qnt <= projects.length ? "Show More" : ""}
        </p>
      </main>
    </div>
  );
}
