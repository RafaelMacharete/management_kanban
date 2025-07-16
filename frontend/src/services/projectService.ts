import { API_URL, getHeaders } from "./baseService";

export async function updateProjectName(projectId: number, name: string) {
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

export async function fetchProjectMembers(projectId: number) {
  try {
    const res = await fetch(`${API_URL}/projects/${projectId}/members/`, { headers: getHeaders(), });
    return await res.json();
  } catch (error) {
    console.error("Error fetching project members:", error);
    throw error;
  }
}


export async function deleteProject(projectId: number) {
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
