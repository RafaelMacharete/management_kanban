import { getHeaders, API_URL } from "./baseService";


export async function addComment(cardId: number, text) {
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