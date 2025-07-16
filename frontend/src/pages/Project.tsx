import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
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
import { uploadFile } from "../services/fileService";
import { fetchColumns } from "../services/columnService";
import type { ICardDetails } from "../pages/types/cardTypes";

type Comment = {
  card: number;
  created_at: string;
  id: number;
  text: string;
  updated_at: string;
}

export type Card = {
  due_date: string;
  id: number;
  name: string;
  position: number;
  priority: string;
  assigned_to: number | null;
  attachments: File[];
  column: number;
  comments: Comment[];
  creation_date: string;
  description: string;
}

interface IColumnFormData {
  id?: number;
  name?: string;
  project_board: number | null;
  position?: number;
  column?: number
}

export interface IColumn {
  id: number;
  name: string;
  position: number;
  project_board: number;
}

interface ICardFormData {
  name: string;
  column: number | null;
  description: string;
  due_date: string;
}

interface ICardsData {
  columns_id: number[]
}

interface IAccounts {
  id: number;
  username: string;
  email: string;
  image_url: string;
  nickname: string | null;
  profile_image: string;
}



const filterOptions = ['Today', 'This Week', 'This Month', 'All'] as const;
type FilterOptions = typeof filterOptions[number];

export function Project() {
  const location = useLocation();
  const { projectid, projectname, projects } = location.state || {};
  const token = localStorage.getItem("token");

  const [allAccounts, setAllAccounts] = useState<IAccounts[]>([]);
  const [projectName, setProjectName] = useState<string>(projectname);
  const [isEditingProjectName, setIsEditingProjectName] = useState<boolean>(false);

  const [activeFilter, setActiveFilter] = useState<FilterOptions>("Today");

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

  const [columns, setColumns] = useState<IColumn[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [cardsData, setCardsData] = useState<ICardsData>();

  const [showCardInfo, setShowCardInfo] = useState<boolean>(false);

  const [selectedCard, setSelectedCard] = useState<ICardDetails | null>(null);

  if (!location.state) {
    window.location.href = "/projects";
  }

  async function handleCardUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (!selectedCard) return;
      console.log(selectedCard);

      const updatedCard = await updateCard(selectedCard.card.id, {
        name: selectedCard.card.name,
        description: selectedCard.card.description,
        due_date: selectedCard.card.due_date,
        priority: Number(selectedCard.card.priority),
        assigned_to_id: selectedCard.card.assigned_to || null,
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

  const handleCardFieldChange = <K extends keyof Card>(field: K, value: Card[K]) => {
    setSelectedCard(prev => {
      
      if (!prev) return prev;

      return {
        ...prev,
        card: {
          ...prev.card,
          [field]: value,
        },
        attachments: prev.attachments,
        comments: prev.comments,
      };
    });
  };




  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    await uploadFile(selectedCard!.card.id, file);
  }

  async function handleUpdateProjectName() {
    if (projectName.trim() === "") {
      alert("Project name cannot be empty");
      return;
    }
    await updateProjectName(projectid, projectName);
  };

  const handleProjectNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value);
  };

  function handleProjectNameKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleUpdateProjectName();
    }
  };

  function handleAddCard(id: number) {
    setShowCardForm(true);
    setCardFormData({ ...cardFormData, column: id });
  }

  function handleAddColumn(id: number) {
    setShowColumnForm(true);
    setColumnFormData({ ...columnData, column: id });
  }

  function handleChangeName(e: ChangeEvent<HTMLInputElement>) {
    setCardFormData({ ...cardFormData, name: e.target.value });
  }

  function handleDueDate(e: ChangeEvent<HTMLInputElement>) {
    setCardFormData({ ...cardFormData, due_date: e.target.value })
  }

  function handleChangeDescription(e: ChangeEvent<HTMLInputElement>) {
    setCardFormData({ ...cardFormData, description: e.target.value });
  }

  function handleChangeColumnName(e: ChangeEvent<HTMLInputElement>) {
    setColumnFormData({ ...columnFormData, name: e.target.value });
  }

  async function handleSubmitColumn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await createColumn(columnFormData);
      if (response.ok) {
        setShowColumnForm(false);
        setColumnFormData({ name: "", project_board: null });
        setReloadProject((prevReloadProjects) => prevReloadProjects + 1);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSubmitCard(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await createCard(cardFormData);
      if (response.ok) {
        setShowCardForm(false);
        setCardFormData({ name: "", column: null, description: "", due_date: new Date().toISOString().split('T')[0] });
        setReloadProject((prevreloadProjects) => prevreloadProjects + 1);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSetShowCardInfo(cardId: number) {
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
    if (!selectedCard) return;

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
        const body: IColumn[] = await fetchColumns(columnData);

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
            handleFileUpload={handleFileUpload}
            handleDeleteCard={handleDeleteCard}
          />
        )}
      </main>
    </div>
  );
}