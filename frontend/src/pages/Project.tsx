import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { Aside } from "../components/Aside";
import { Header } from "../components/Header";
import { RxDoubleArrowLeft } from "react-icons/rx";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { Form } from "../components/Form";
import BoardContent from "../components/project_board/BoardContent";
import CardDetailModal from "../components/project_board/CardDetailModal";
import { updateProjectName, fetchProjectMembers } from '../services/projectService';
import { createCard, createColumn, deleteCard, fetchCardDetails, fetchCards, updateCard } from "../services/cardService";
import { addComment } from "../services/commentService";
import { uploadFile } from "../services/fileService";
import { fetchColumns } from "../services/columnService";

type Comment = {
  card: number;
  created_at: string;
  id: number;
  text: string;
  updated_at: string;
}

type Card = {
  id: number;
  name: string;
  position: number;
  priority: number;
  assigned_to: number | null;
  attachments: any[];
  column: number;
  comments: Comment[];
  creation_date: string;
  description: string;
}

interface IProjects {
  id: number;
  name: string;
  favorite: boolean;
  members: number[];
}
interface IAccounts {
  id: number;
  username: string;
  email: string;
  image_url: string;
  nickname: string | null;
  profile_image: string;
}

interface IColumnFormData {
  id?: number;
  name: string;
  project_board: number | null;
  position: number;
}

interface ICardDetails {
  attachments: any[];
  card: Card;
  comments: Comment[]
}

interface ICardFormData {
  name: string;
  column: number | null;
  description: string;
  due_date: string;
}

export interface ICard {
  id: number;
  name: string;
  column: number;
  description: string;
  creation_date: string; 
}

type FilterOptions = 'Today' | 'This Week' | 'This Month' | 'All'

export function Project() {
  const location = useLocation();
  const { projectid, projectname, projects } = location.state || {};
  const token = localStorage.getItem("token");

  const [allAccounts, setAllAccounts] = useState([]);
  const [projectName, setProjectName] = useState<string>(projectname);
  const [isEditingProjectName, setIsEditingProjectName] = useState<boolean>(false);

  const [activeFilter, setActiveFilter] = useState<FilterOptions>("Today");
  const filterOptions = ["Today", "This Week", "This Month", "All"];

  const [reloadProjects, setReloadProject] = useState<number>(0);

  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [showCardForm, setShowCardForm] = useState<boolean>(false);
  const [showColumnForm, setShowColumnForm] = useState<boolean>(false);

  const [projectSearched, setProjectSearched] = useState([]);

  const [columnFormData, setColumnFormData] = useState<IColumnFormData>({
    name: "",
    project_board: null,
    position: 1,
  });

  const columnData: { project_board: number } = { project_board: projectid };

  const [cardFormData, setCardFormData] = useState<ICardFormData>({
    name: "",
    column: null,
    description: "",
    due_date: new Date().toISOString().split('T')[0]
  });

  const [columns, setColumns] = useState([]);
  const [cards, setCards] = useState([]);
  const [cardsData, setCardsData] = useState();

  const [showCardInfo, setShowCardInfo] = useState<boolean>(false);

  const [selectedCard, setSelectedCard] = useState<ICardDetails | null>(null);

  if (!location.state) {
    window.location.href = "/projects";
  }

  async function handleCardUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const updatedCard = await updateCard(selectedCard.card.id, {
        name: selectedCard.card.name,
        description: selectedCard.card.description,
        due_date: selectedCard.card.due_date,
        priority: selectedCard.card.priority,
        assigned_to_id: selectedCard.card.assigned_to?.id || null,
        column: selectedCard.card.column
      });

      if (updatedCard?.due_date !== selectedCard.card.due_date) {
        console.log("Due date not updated:", updatedCard);
      }

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

    await addComment(selectedCard.card.id, newComment);
  };

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    await uploadFile(selectedCard.card.id, file);
  };

  async function handleUpdateProjectName() {
    if (projectName.trim() === "") {
      alert("Project name cannot be empty");
      return;
    }
    await updateProjectName(projectid, projectName);
  };

  const handleProjectNameChange = (e) => {
    setProjectName(e.target.value);
  };

  function handleProjectNameKeyDown(e) {
    if (e.key === "Enter") {
      handleUpdateProjectName();
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

  function handleDueDate(e) {
    setCardFormData({ ...cardFormData, due_date: e.target.value })
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
      const response = await createColumn(columnFormData, token);
      if (response.ok) {
        setShowColumnForm(false);
        setColumnFormData({ name: "", project_board: null });
        setReloadProject((prevReloadProjects) => prevReloadProjects + 1);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSubmitCard(e) {
    e.preventDefault();
    try {
      const response = await createCard(cardFormData, token);
      if (response.ok) {
        setShowCardForm(false);
        setCardFormData({ name: "", column: null, description: "", due_date: new Date().toISOString().split('T')[0] });
        setReloadProject((prevreloadProjects) => prevreloadProjects + 1);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSetShowCardInfo(cardId) {
    try {
      const cardDetails = await fetchCardDetails(cardId);

      console.log(cardDetails);
      
      setSelectedCard(cardDetails);
      setShowCardInfo(true);
    } catch (error) {
      console.error("Error fetching card details:", error);
    }
  }

  async function handleDeleteCard() {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    const success = await deleteCard(selectedCard.card.id);
    if (success) {
      setCards(prev => prev.filter(card => card.id !== selectedCard.card.id));
      setShowCardInfo(false);
    } else {
      alert("Failed to delete the card.");
    }
  }

  useEffect(() => {
    async function loadProjectMembers() {
      try {
        const members = await fetchProjectMembers(projectid);

        setAllAccounts(members);
      } catch (error) {
        console.error("Failed to load project members:", error);
      }
    }
    loadProjectMembers();
  }, [projectid, token]);

  useEffect(() => {
    async function fetchData() {
      try {
        const body = await fetchColumns(columnData);

        setColumns(body);
        
        const columnsIds = {
          columns_id: body.map((col) => col.id),
        };
        setCardsData(columnsIds);

        try {
          if (columnsIds.columns_id.length <= 0) return;
          const fetchedCards = await fetchCards(columnsIds);
          setCards(fetchedCards)
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

        <BoardContent
          isEditingProjectName={isEditingProjectName}
          projectName={projectName}
          handleProjectNameChange={handleProjectNameChange}
          handleProjectNameKeyDown={handleProjectNameKeyDown}
          handleUpdateProjectName={handleUpdateProjectName}
          setIsEditingProjectName={setIsEditingProjectName}
          filterOptions={filterOptions}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          columns={columns}
          cards={cards}
          handleSetShowCardInfo={handleSetShowCardInfo}
          handleAddCard={handleAddCard}
          handleAddColumn={handleAddColumn}
          projectid={projectid}
        />

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
            handleSubmit={handleSubmitCard}
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
            toCreate="Column"
            allAccounts={allAccounts}
          />
        )}

        {showCardInfo && (
          <CardDetailModal
            selectedCard={selectedCard}
            columns={columns}
            allAccounts={allAccounts}
            setShowCardInfo={setShowCardInfo}
            handleCardUpdate={handleCardUpdate}
            handleCardFieldChange={handleCardFieldChange}
            handleAddComment={handleAddComment}
            newComment={newComment}
            setNewComment={setNewComment}
            handleFileUpload={handleFileUpload}
            handleDeleteCard={handleDeleteCard}
          />
        )}
      </main>
    </div>
  );
}