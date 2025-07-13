import { API_URL, getHeaders } from "./baseService";

export async function uploadFile(cardId: number, file) {
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
