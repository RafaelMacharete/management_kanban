import { API_URL, getHeaders } from "./baseService";

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
