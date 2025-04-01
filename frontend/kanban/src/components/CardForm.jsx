import { useState } from "react";

export function CardForm() {
  const [formData, setFormData] = useState({
    name: "",
    column: "",
    description: "",
    position: 1,
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetch("http://127.0.0.1:8000/cards/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => alert("Card criado com sucesso!"))
      .catch((err) => alert("Erro ao criar card"));
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#ddd] p-6 rounded-lg shadow-md max-w-md mx-auto">
      <input
        type="text"
        name="name"
        placeholder="Nome do Card"
        onChange={handleChange}
        required
        className="w-full p-3 mb-4 border border-[#787486] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5030E5]"
      />
      <input
        type="number"
        name="column"
        placeholder="ID da Coluna"
        onChange={handleChange}
        required
        className="w-full p-3 mb-4 border border-[#787486] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5030E5]"
      />
      <textarea
        name="description"
        placeholder="Descrição"
        onChange={handleChange}
        required
        className="w-full p-3 mb-4 border border-[#787486] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5030E5] resize-none"
        rows="4"
      ></textarea>
      <input
        type="number"
        name="position"
        placeholder="Posição"
        onChange={handleChange}
        required
        className="w-full p-3 mb-4 border border-[#787486] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5030E5]"
      />
      <button
        type="submit"
        className="w-full p-3 bg-[#5030E5] text-white rounded-md hover:bg-[#787486] transition-colors focus:outline-none focus:ring-2 focus:ring-[#5030E5]"
      >
        Criar Card
      </button>
    </form>

  );
}