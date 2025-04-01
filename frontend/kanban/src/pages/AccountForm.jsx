import { useState } from "react";

export function AccountForm() {
    const [formData, setFormData] = useState({
      username: "",
      password: "",
      email: "",
      phone_number: "",
      is_staff: "",
    });
  
    function handleChange(e) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  
    function handleSubmit(e) {
      e.preventDefault();
      fetch("http://127.0.0.1:8000/createuser/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((data) => alert("Usuário criado com sucesso!"))
        .catch((err) => alert("Erro ao criar usuário"));
    }
  
    return (
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Nome de usuário" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Senha" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="number" name="phone_number" placeholder="Número de telefone" onChange={handleChange} required />
        <input type="text" name="is_staff" placeholder="staff" onChange={handleChange} required />
        <button type="submit">Criar Conta</button>
      </form>
    );
  }