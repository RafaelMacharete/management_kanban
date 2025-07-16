import { getHeaders, API_URL } from "./baseService";

interface ISelectedCard {
  name: string;
  due_date: string;
  priority: number;
  assigned_to_id: number | null;
  column: number;
  description: string;
}

interface ICardFormData {
  name: string;
  column: number | null;
  description: string;
  due_date: string;
}

interface IColumnFormData {
  id?: number;
  name?: string;
  project_board: number | null;
  position?: number;
  column?: number
}

export async function fetchCardDetails(cardId: number) {
  try {
    const res = await fetch(`${API_URL}/cards/${cardId}/detail/`, { headers: getHeaders(), });
    return await res.json();
  } catch (error) {
    console.error("Error fetching card details:", error);
    return null;
  }
}

export async function updateCard(cardId: number, data: ISelectedCard) {
  try {
    const res = await fetch(`${API_URL}/cards/${cardId}/update/`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const body = await res.json();

    if (!res.ok) console.error("Erro ao atualizar card:", body);

    return body;
  } catch (error) {
    console.error("Error updating card:", error);
    return null;
  }
}


export async function fetchCards(columns_id: {columns_id: number[]}) {
  try {
    const res = await fetch(`${API_URL}/card/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(columns_id),
    });
    return await res.json();
  } catch (error) {
    console.error("Error fetching cards:", error);
    throw error;
  }
}

export async function createCard(cardData: ICardFormData) {
  try {
    console.log(cardData);
    
    const res = await fetch(`${API_URL}/cards/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(cardData),
    });
    return res;
  } catch (error) {
    console.error("Error creating card:", error);
    throw error;
  }
}

export async function createColumn(columnData: IColumnFormData) {
  try {
    const res = await fetch(`${API_URL}/columns/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(columnData),
    });
    return res;
  } catch (error) {
    console.error("Error creating column:", error);
    throw error;
  }
}

export async function deleteCard(cardId: number) {
  try {
    const res = await fetch(`${API_URL}/cards/${cardId}/`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Erro ao deletar card: ${res.status} - ${errorBody}`);
    }

    return true;
  } catch (error) {
    console.error("Erro ao deletar o card:", error);
    return false;
  }
}
