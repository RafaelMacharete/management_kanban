export const API_URL = "https://trellio.onrender.com";

export function getHeaders(isFormData: boolean = false) {
    const token = localStorage.getItem("token");
    return {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        Authorization: `Bearer ${token}`,
    };
} 