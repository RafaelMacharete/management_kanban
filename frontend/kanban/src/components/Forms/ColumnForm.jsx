import { useState } from "react";

export function ColumnForm() {
  const [formData, setFormData] = useState({
    name: "",
    project_board: "",
    position: 1,
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetch("http://127.0.0.1:8000/columns/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => alert("Coluna criada com sucesso!"))
      .catch((err) => alert("Erro ao criar coluna"));
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Nome da Coluna"
        onChange={handleChange}
        required
        className="w-full p-3 mb-4 border border-[#787486] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5030E5]" />
      <input
        type="number"
        name="project_board"
        placeholder="ID do Projeto"
        onChange={handleChange}
        required
        className="w-full p-3 mb-4 border border-[#787486] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5030E5]" />
      <input
        type="number"
        name="position"
        placeholder="Posição"
        onChange={handleChange}
        required
        className="w-full p-3 mb-4 border border-[#787486] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5030E5]" />
      <button
        type="submit"
        className="w-full p-3 bg-[#5030E5] text-white rounded-md hover:bg-[#787486] focus:outline-none focus:ring-2 focus:ring-[#5030E5]">Criar Coluna</button>
    </form>
  );
}