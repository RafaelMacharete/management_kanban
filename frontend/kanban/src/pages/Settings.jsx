import { useEffect, useState } from "react";

export function Settings() {
    const [userData, setUserData] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch("https://trellio.onrender.com/accounts/me/", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => setUserData(data))
            .catch(err => console.error("Erro ao carregar usuário:", err));
    }, []);

    if (!userData) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">User Settings</h2>

            <div className="space-y-4">
                <div>
                    <label className="text-sm text-gray-500">Username</label>
                    <div className="text-lg font-medium">{userData.username}</div>
                </div>
                <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <div className="text-lg font-medium">{userData.email}</div>
                </div>
                <div>
                    <label className="text-sm text-gray-500">Nickname</label>
                    <div className="text-lg font-medium">{userData.nickname || "—"}</div>
                </div>
                <div>
                    <label className="text-sm text-gray-500">Profile Image</label>
                    <div className="mt-2">
                        <img
                            src={userData.image_url}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border border-gray-300"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
