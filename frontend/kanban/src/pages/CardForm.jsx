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
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Nome do Card" onChange={handleChange} required />
        <input type="number" name="column" placeholder="ID da Coluna" onChange={handleChange} required />
        <textarea name="description" placeholder="Descrição" onChange={handleChange} required></textarea>
        <input type="number" name="position" placeholder="Posição" onChange={handleChange} required />
        <button type="submit">Criar Card</button>
      </form>
    );
  }