const API_URL = "https://trellio.onrender.com";

function getHeaders(isFormData = false) {
  const token = localStorage.getItem("token");
  return {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchCardDetails(cardId) {
  try {
    const res = await fetch(`${API_URL}/cards/${cardId}/detail/`, { headers: getHeaders(), });
    return await res.json();
  } catch (error) {
    console.error("Error fetching card details:", error);
    return null;
  }
}

export async function updateCard(cardId, data) {
  try {
    const res = await fetch(`${API_URL}/cards/${cardId}/update/`, {
      method: "PATCH",
      headers,
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

export async function addComment(cardId, text) {
  try {
    const res = await fetch(`${API_URL}/comments/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ card: cardId, text }),
    });
    return await res.json();
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}

export async function uploadFile(cardId, file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("card", cardId);

  try {
    const res = await fetch(`${API_URL}/attachments/`, {
      method: "POST",
      headers: getHeaders(true),
      body: formData,
    });

    return await res.json();
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

export async function updateProjectName(projectId, name) {
  try {
    const res = await fetch(`${API_URL}/projects/${projectId}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ name }),
    });
    return await res.json();
  } catch (error) {
    console.error("Error updating project name:", error);
    throw error;
  }
}

export async function fetchProjectMembers(projectId) {
  try {
    const res = await fetch(`${API_URL}/projects/${projectId}/members/`, { headers: getHeaders(), });
    return await res.json();
  } catch (error) {
    console.error("Error fetching project members:", error);
    throw error;
  }
}

export async function fetchColumns(columnData) {
  try {
    const res = await fetch(`${API_URL}/column/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(columnData),
    });
    return await res.json();
  } catch (error) {
    console.error("Error fetching columns:", error);
    throw error;
  }
}

export async function fetchCards(columns_id) {
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

export async function createCard(cardData) {
  try {
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

export async function createColumn(columnData) {
  try {
    const res = await fetch(`${API_URL}/columns/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(columnData),
    });
    return await res;
  } catch (error) {
    console.error("Error creating column:", error);
    throw error;
  }
}

export async function deleteCard(cardId) {
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

export async function deleteProject(projectId) {
  try {
    const res = await fetch(`${API_URL}/projects/${projectId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Erro ao excluir projeto:", res.status, body);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erro ao excluir projeto:", error);
    return false;
  }
}
