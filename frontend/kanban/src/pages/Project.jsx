import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Aside } from "../components/Aside";
import { Header } from "../components/Header";
import { RxDoubleArrowLeft } from "react-icons/rx";
import { FaPen, FaCheck } from "react-icons/fa";
import { CiGrid2H, CiGrid41 } from "react-icons/ci";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { Form } from "../components/Form";
import { PiTimerLight } from "react-icons/pi";
import { HiMiniPencilSquare } from "react-icons/hi2";


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

  const [projectSearched, setProjectSearched] = useState([]);


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

  const [showCardInfo, setShowCardInfo] = useState(false);

  const [selectedCard, setSelectedCard] = useState(null);

  if (!location.state) {
    window.location.href = "/projects";
  }

  async function fetchCardDetails(cardId) {
    try {
      const response = await fetch(`https://trellio.onrender.com/cards/${cardId}/detail/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching card details:', error);
      return null;
    }
  }

  async function updateCard(cardId, data) {
    try {
      const response = await fetch(`https://trellio.onrender.com/cards/${cardId}/update/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
      console.log(data);
      return await response.json();
    } catch (error) {
      console.error('Error updating card:', error);
      return null;
    }
  }

  async function handleCardUpdate(e) {
    e.preventDefault();
    try {
      const updatedCard = await updateCard(selectedCard.card.id, {
        name: selectedCard.card.name,
        description: selectedCard.card.description,
        due_date: selectedCard.card.due_date,
        priority: selectedCard.card.priority,
        assigned_to: selectedCard.card.assigned_to?.id || null,
        column: selectedCard.card.column
      });

      if (updatedCard) {
        setCards(cards.map(card => card.id === updatedCard.id ? updatedCard : card));
        setShowCardInfo(false);
      }
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  const handleCardFieldChange = (field, value) => {
    setSelectedCard(prev => ({ ...prev, card: { ...prev.card, [field]: value } }));
  };

  const [newComment, setNewComment] = useState("");

  async function handleAddComment(e) {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch('https://trellio.onrender.com/comments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          card: selectedCard.card.id,
          text: newComment
        })
      });

      if (response.ok) {
        const comment = await response.json();
        setSelectedCard(prev => ({ ...prev, comments: [...prev.comments, comment] }));
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('card', selectedCard.card.id);

    try {
      const response = await fetch('https://trellio.onrender.com/attachments/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const attachment = await response.json();
        setSelectedCard(prev => ({ ...prev, attachments: [...prev.attachments, attachment] }));
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  async function updateProjectName() {
    if (projectName.trim() === "") {
      alert("Project name cannot be empty");
      return;
    }
    try {
      const response = await fetch(`https://trellio.onrender.com/projects/${projectid}`, {
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

  function handleProjectNameKeyDown(e) {
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
      const response = await fetch(`https://trellio.onrender.com/columns/`, {
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
      const response = await fetch(`https://trellio.onrender.com/cards/`, {
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

  async function handleSetShowCardInfo(cardId) {
    try {
      const cardDetails = await fetchCardDetails(cardId);
      setSelectedCard(cardDetails);
      setShowCardInfo(true);
    } catch (error) {
      console.error("Error fetching card details:", error);
    }
  }


  useEffect(() => {
    async function fetchProjectMembers() {
      try {
        const response = await fetch(`https://trellio.onrender.com/projects/${projectid}/members/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const members = await response.json();
        setAllAccounts(members);
      } catch (error) {
        console.error("Error fetching project members:", error);
      }
    }

    fetchProjectMembers();
  }, [projectid, token]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`https://trellio.onrender.com/column/`, {
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
          const response = await fetch(`https://trellio.onrender.com/card/`, {
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

      <Header
        showSidebar={showSidebar}
        projectSearched={projectSearched}
        setProjectSearched={setProjectSearched}
      />

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
                        onClick={() => handleSetShowCardInfo(card.id)}
                        key={card.id}
                        className="p-3 bg-gray-50 border border-gray-200 hover:border-gray-300 cursor-pointer"
                      >
                        <p className="text-sm font-medium text-gray-800 mb-1">{card.name}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <PiTimerLight size={12} className="mr-1" />
                          <span>{new Date(card.due_date).toLocaleDateString()}</span>
                          <div className="flex items-center gap-1 ml-auto" onClick={handleSetShowCardInfo}>
                            <HiMiniPencilSquare size={12} className="text-gray-400" />
                          </div>
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

        {showCardInfo && selectedCard && (
          <div className="fixed top-0 left-0 w-full h-full bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="border-b border-gray-200 p-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Card Details</h3>
                <button
                  onClick={() => setShowCardInfo(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Card Title */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-lg font-medium"
                    value={selectedCard.card.name || ''}
                    onChange={(e) => handleCardFieldChange('name', e.target.value)}
                  />
                </div>

                {/* Card Description */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                    value={selectedCard.card.description || ''}
                    onChange={(e) => handleCardFieldChange('description', e.target.value)}
                  ></textarea>
                </div>

                {/* Card Meta Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Due Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                      value={selectedCard.card.due_date || ''}
                      onChange={(e) => handleCardFieldChange('due_date', e.target.value)}
                    />
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                      value={selectedCard.card.priority || 'medium'}
                      onChange={(e) => handleCardFieldChange('priority', e.target.value)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Column</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                      value={selectedCard.card.column}
                      onChange={(e) => handleCardFieldChange('column', parseInt(e.target.value))}
                    >
                      {columns.map(column => (
                        <option key={column.id} value={column.id}>{column.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Assignee */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                      value={selectedCard.card.assigned_to?.id || ''}
                      onChange={(e) => handleCardFieldChange('assigned_to', e.target.value ? parseInt(e.target.value) : null)}
                    >
                      <option value="">Unassigned</option>
                      {allAccounts.map(account => (
                        <option key={account.id} value={account.id}>{account.username}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Attachments */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
                  {selectedCard.attachments.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {selectedCard.attachments.map(attachment => (
                        <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <a
                            href={attachment.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {attachment.name}
                          </a>
                          <button className="text-red-500 hover:text-red-700">
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                    <p className="text-sm text-gray-500 mb-2">Drag & drop files here or click to upload</p>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <label
                      htmlFor="file-upload"
                      className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition cursor-pointer inline-block"
                    >
                      Upload Files
                    </label>
                  </div>
                </div>

                {/* Comments Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                  <div className="space-y-4">
                    {/* Comment Input */}
                    <form onSubmit={handleAddComment} className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-600">U</span>
                        </div>
                      </div>
                      <div className="flex-grow">
                        <textarea
                          rows="2"
                          placeholder="Add a comment..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        ></textarea>
                        <div className="mt-2 flex justify-end">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition"
                          >
                            Comment
                          </button>
                        </div>
                      </div>
                    </form>

                    {/* Existing Comments */}
                    <div className="border-t border-gray-200 pt-4 space-y-4">
                      {selectedCard.comments.map(comment => (
                        <div key={comment.id} className="flex gap-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-gray-600">{comment.user.username.charAt(0)}</span>
                            </div>
                          </div>
                          <div className="flex-grow">
                            <div className="bg-gray-50 p-3 rounded-md">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium">{comment.user.username}</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(comment.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{comment.text}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 p-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowCardInfo(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCardUpdate}
                  className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}