import { useState } from "react";

export function ProjectForm() {
  const [formData, setFormData] = useState({
    name: "",
    members: "",
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetch("http://127.0.0.1:8000/projectboards/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        members: formData.members.split(",").map((id) => parseInt(id.trim())),
      }),
    })
      .then((res) => res.json())
      .then((data) => alert("Projeto criado com sucesso!"))
      .catch((err) => alert("Erro ao criar projeto"));
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#ddd] p-6 rounded-lg shadow-md max-w-md mx-auto">
      <input
        type="text"
        name="name"
        placeholder="Nome do Projeto"
        onChange={handleChange}
        required
        className="w-full p-3 mb-4 border border-[#787486] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5030E5]"
      />
      <input
        type="text"
        name="members"
        placeholder="Members id's (by comma)"
        onChange={handleChange}
        className="w-full p-3 mb-4 border border-[#787486] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5030E5]"
      />
      <button type="submit" className="w-full p-3 bg-[#5030E5] text-white rounded-md hover:bg-[#787486] focus:outline-none focus:ring-2 focus:ring-[#5030E5]">
        Criar Projeto
      </button>
    </form>
  );
}
