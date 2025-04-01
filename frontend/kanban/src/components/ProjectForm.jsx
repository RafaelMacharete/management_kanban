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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Nome do Projeto"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="members"
        placeholder="IDs dos Membros (separados por vírgula)"
        onChange={handleChange}
      />
      <button type="submit">Criar Projeto</button>
    </form>
  );
}
