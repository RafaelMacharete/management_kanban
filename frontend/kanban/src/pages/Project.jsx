import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Aside } from "../components/aside";
import { Header } from "../components/Header";
import { RxDoubleArrowLeft } from "react-icons/rx";
import { FaPen, FaCheck } from "react-icons/fa";
import { CiGrid2H, CiGrid41 } from "react-icons/ci";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { Form } from "../components/Form";
import { PiTimerLight } from "react-icons/pi";

export function Project() {
  const location = useLocation();
  const { projectid, projectname, projects } = location.state || {};
  const token = localStorage.getItem("token");

  const [allAccounts, setAllAccounts] = useState([]);
  const [projectName, setProjectName] = useState(projectname);
  const [isEditingProjectName, setIsEditingProjectName] = useState(false);

  const [activeFilter, setActiveFilter] = useState("Today");
  const filterOptions = ["Today", "This Week", "This Month", "All"];

  const [reloadProjects, setReloadProject] = useState(0);

  const [showSidebar, setShowSidebar] = useState(true);
  const [showCardForm, setShowCardForm] = useState(false);
  const [showColumnForm, setShowColumnForm] = useState(false);

  const date = new Date('2025-04-17');

  const [columnFormData, setColumnFormData] = useState({
    name: "",
    project_board: null,
    position: 1,
  });
  const columnData = { project_board: projectid };
  const [cardFormData, setCardFormData] = useState({
    name: "",
    column: null,
    description: "",
  });

  const [columns, setColumns] = useState([]);
  const [cards, setCards] = useState([]);
  const [cardsData, setCardsData] = useState();

  if (!location.state) {
    window.location.href = "/projects";
  }

  const updateProjectName = async () => {
    try {
      const response = await fetch(`http://localhost:8000/projects/${projectid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: projectName }),
      });

      if (response.ok) {
        setIsEditingProjectName(false);
      } else {
        console.error("Failed to update project name");
      }
    } catch (error) {
      console.error("Error updating project name:", error);
    }
  };

  const handleProjectNameChange = (e) => {
    setProjectName(e.target.value);
  };

  const handleProjectNameKeyDown = (e) => {
    if (e.key === "Enter") {
      updateProjectName();
    }
  };

  function handleAddCard(id) {
    setShowCardForm(true);
    setCardFormData({ ...cardFormData, column: id });
  }

  function handleAddColumn(id) {
    setShowColumnForm(true);
    setColumnFormData({ ...columnData, column: id });
  }

  function handleChangeName(e) {
    setCardFormData({ ...cardFormData, name: e.target.value });
  }

  function handleChangeDescription(e) {
    setCardFormData({ ...cardFormData, description: e.target.value });
  }

  function handleChangeColumnName(e) {
    setColumnFormData({ ...columnFormData, name: e.target.value });
  }

  async function handleSubmitColumn(e) {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/columns/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(columnFormData),
      });
      if (response.ok) {
        setShowColumnForm(false);
        setColumnFormData({ name: "", project_board: null });
        setReloadProject((prevReloadProjects) => prevReloadProjects + 1);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/cards/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cardFormData),
      });
      if (response.ok) {
        setShowCardForm(false);
        setCardFormData({ name: "", column: null, description: "" });
        setReloadProject((prevreloadProjects) => prevreloadProjects + 1);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:8000/column/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(columnData),
        });
        const body = await response.json();
        setColumns(body);
        const columnsIds = {
          columns_id: body.map((col) => col.id),
        };

        setCardsData(columnsIds);

        try {
          if (columnsIds.columns_id.length <= 0) return;
          const response = await fetch(`http://localhost:8000/card/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(columnsIds),
          });
          const body = await response.json();
          setCards(body);
        } catch (error) {
          console.log("error: ", error);
        }
      } catch (error) {
        console.log("error: ", error);
      }
    }
    fetchData();
  }, [reloadProjects]);

  return (
    <div
      className={`min-h-screen grid ${showSidebar ? "grid-cols-[250px_1fr]" : "grid-cols-[0px_1fr]"
        } grid-rows-[70px_1fr_1fr] bg-gray-100`}
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

      <Header />

      <main className="row-span-2 bg-gray-50 p-6 overflow-y-auto space-y-6">
        <div className="border border-gray-400 w-min rounded-full hover:bg-gray-100 relative">
          <Link to="/projects">
            <MdKeyboardDoubleArrowLeft size={25} />
          </Link>
        </div>
        <section className="max-w-[1400px] mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isEditingProjectName ? (
                <div className="flex items-center gap-2">
                  <input
                    className="text-2xl font-semibold text-gray-800 border-b border-gray-400 focus:outline-none focus:border-violet-600"
                    value={projectName}
                    onChange={handleProjectNameChange}
                    onKeyDown={handleProjectNameKeyDown}
                    autoFocus
                  />
                  <button
                    className="text-violet-600 hover:text-violet-800 transition"
                    onClick={updateProjectName}
                  >
                    <FaCheck size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold text-gray-800">{projectName}</h2>
                  <button
                    className="text-gray-400 hover:text-violet-600 transition"
                    onClick={() => setIsEditingProjectName(true)}
                  >
                    <FaPen size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex gap-1 bg-gray-50 p-1 border border-gray-200">
                {filterOptions.map((option) => (
                  <button
                    key={option}
                    className={`px-3 py-1 text-xs font-medium transition ${activeFilter === option
                      ? "bg-violet-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                      }`}
                    onClick={() => setActiveFilter(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button className="p-1 text-gray-400 hover:text-violet-600">
                  <CiGrid2H size={20} />
                </button>
                <button className="p-1 text-gray-400 hover:text-violet-600">
                  <CiGrid41 size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 bg-white border border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Showing tasks for:{" "}
              <span className="font-medium text-gray-800">
                {activeFilter}
              </span>
            </p>
          </div>
          <div className="flex gap-3 overflow-x-auto bg-cover bg-no-repeat">
            {columns && columns.map((column) => (
              <div
                key={column.id}
                className="bg-white border border-gray-300  w-72 p-2 h-min"
              >
                <div className="flex items-center py-2 gap-2 ">
                  <h2 className="text-lg font-semibold text-gray-800 text-center">
                    {column.name}
                  </h2>
                  <h2 className="bg-gray-300 rounded-full w-[24px] text-center font-light">
                    {cards.filter((card) => card.column === column.id).length}
                  </h2>
                </div>

                <div className="flex flex-col gap-2">
                  {cards
                    .filter((card) => card.column === column.id)
                    .map((card) => (
                      <div
                        key={card.id}
                        className="p-3 bg-gray-50 border border-gray-200 hover:border-gray-300 cursor-pointer"
                      >
                        <p className="text-sm font-medium text-gray-800 mb-1">{card.name}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <PiTimerLight className="mr-1" />
                          <span>{card.creation_date}</span>
                        </div>
                      </div>
                    ))}

                  <button
                    className="text-sm text-black hover:text-cyan-700 hover:bg-gray-100 py-2 cursor-pointer"
                    onClick={() => handleAddCard(column.id)}
                  >
                    + Add new Card
                  </button>
                </div>
              </div>
            ))}
            <button
              className="bg-white border border-gray-300   w-72 p-4 h-15 flex items-center gap-2 cursor-pointer opacity-85"
              onClick={() => handleAddColumn(projectid)}
            >
              <IoMdAdd />
              <h2>Add new column</h2>
            </button>
          </div>
        </section>

        {showCardForm && (
          <Form
            fields={[
              {
                label: "Card name",
                htmlFor: "project",
                placeholder: "Card name",
                onChange: handleChangeName,
              },
              {
                label: "Description",
                htmlFor: "members",
                placeholder: "Description",
                onChange: handleChangeDescription,
              },
            ]}
            handleSubmit={handleSubmit}
            setShowForm={setShowCardForm}
            toCreate="Card"
          />
        )}

        {showColumnForm && (
          <Form
            fields={[
              {
                label: "Column name",
                htmlFor: "column",
                placeholder: "Column name",
                onChange: handleChangeColumnName,
              },
            ]}
            handleSubmit={handleSubmitColumn}
            setShowForm={setShowColumnForm}
            toCreate="Project"
            allAccounts={allAccounts}
          />
        )}
      </main>
    </div>
  );
}