import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Aside } from "../components/aside";
import { Header } from "../components/Header";
import { RxDoubleArrowLeft } from "react-icons/rx";
import { FaPen } from "react-icons/fa";
import { CiGrid2H, CiGrid41 } from "react-icons/ci";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { Form } from "../components/Form";

export function Project() {
  const location = useLocation();
  const { projectid } = location.state || {};
  const { projectname } = location.state || {};
  const { projects } = location.state || {};

  const [activeFilter, setActiveFilter] = useState("Today");
  const filterOptions = ["Today", "This Week", "This Month", "All"];

  const [reloadProjects, setReloadProject] = useState(0);

  const [showSidebar, setShowSidebar] = useState(true);
  const [showCardForm, setShowCardForm] = useState(false);
  const [showColumnForm, setShowColumnForm] = useState(false);

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

  function handleAddCard(id) {
    // Set Modal on and add id to column on CardFormData
    setShowCardForm(true);
    setCardFormData({ ...cardFormData, column: id });
  }

  function handleAddColumn(id) {
    // Set Modal on and add id to column on ColumnFormData
    setShowColumnForm(true);
    setColumnFormData({ ...columnData, column: id });
  }

  function handleChangeName(e) {
    // On name input change, add into cardFormData
    setCardFormData({ ...cardFormData, name: e.target.value });
    console.log(cardFormData);
  }

  function handleChangeDescription(e) {
    // On description input change, add into cardFormData
    setCardFormData({ ...cardFormData, description: e.target.value });
  }

  function handleChangeColumnName(e) {
    // On name input change, add into columnFormData
    setColumnFormData({ ...columnFormData, name: e.target.value });
  }

  async function handleSubmitColumn(e) {
    /* 
    On submit column form, if input is valid, create a new column,
    clear the input, and reload component listening to reloadProject state
    */
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/columns/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    /* 
    On submit card form, if inputs are valid, create a new card,
    clear the input, and reload component listening to reloadProject state
    */
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/cards/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    /*
    when reloadProject state is updated, columns and card also reload,
    to prevent a error on first column creation, if columnsIds lower or equals
    than 0 don't do anything forward.
    */
    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:8000/column/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(columnData),
        });
        const body = await response.json();
        setColumns(body);
        const columnsIds = {
          columns_id: body.map((col) => col.id),
        };

        setCardsData(columnsIds);

        try {
          console.log(columnsIds.columns_id.length);
          if (columnsIds.columns_id.length <= 0) return;
          const response = await fetch(`http://localhost:8000/card/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
      className={`min-h-screen grid ${
        showSidebar ? "grid-cols-[250px_1fr]" : "grid-cols-[0px_1fr]"
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
          className="absolute top-4 left-2 z-50 bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition"
        >
          <RxDoubleArrowLeft
            size={20}
            className="rotate-180 text-gray-600 hover:text-violet-600 transition"
          />
        </button>
      )}

      <Header />

      <main className="row-span-2 bg-gray-50 p-6 overflow-y-auto space-y-6">
        <div className="border border-gray-400 w-min rounded-xl hover:bg-gray-100 relative">
          <Link to="/projects">
            <MdKeyboardDoubleArrowLeft size={25} />
          </Link>
        </div>
        <section className="max-w-8xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-gray-800">
              <h1 className="text-2xl font-bold">{projectname}</h1>
              <FaPen className="text-gray-500 hover:text-violet-600 transition cursor-pointer" />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-300">
                {filterOptions.map((option) => (
                  <button
                    key={option}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition ${
                      activeFilter === option
                        ? "bg-violet-500 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveFilter(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 text-gray-600 cursor-pointer">
                <CiGrid2H
                  size={24}
                  className="hover:text-violet-600 transition"
                />
                <CiGrid41
                  size={24}
                  className="hover:text-violet-600 transition"
                />
              </div>
            </div>
          </div>

          {/* Project content based on activeFilter */}
          <div className="p-4 bg-white rounded-xl text-center text-gray-500 border-1 border-gray-300">
            <p className="text-sm">
              Showing tasks for:{" "}
              <span className="font-semibold text-gray-800">
                {activeFilter}
              </span>
            </p>
          </div>
          <div className="flex gap-3 p-4 overflow-x-auto bg-cover bg-no-repeat">
            {columns.map((column) => (
              <div
                key={column.id}
                className="bg-white border border-gray-300 rounded-2xl w-72 p-4 h-min"
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
                        className="bg-gray-100 border border-gray-300 rounded-xl p-3 text-gray-700 hover:bg-gray-200 cursor-pointer"
                      >
                        {card.name}
                      </div>
                    ))}

                  <button
                    className="mt-2 text-sm text-black hover:text-cyan-700 hover:bg-gray-100 border border-dashed border-cyan-300 rounded-xl py-2 cursor-pointer"
                    onClick={() => handleAddCard(column.id)}
                  >
                    + Add new Card
                  </button>
                </div>
              </div>
            ))}
            <button
              className="bg-white border border-gray-300 rounded-2xl w-72 p-4 h-15 flex items-center gap-2 cursor-pointer opacity-85"
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
                onChange: handleChangeName,
              },
              {
                label: "Description",
                htmlFor: "members",
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
                onChange: handleChangeColumnName,
              },
            ]}
            handleSubmit={handleSubmitColumn}
            setShowForm={setShowColumnForm}
            toCreate="Project"
          />
        )}
      </main>
    </div>
  );
}
