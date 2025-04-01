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
    <form onSubmit={handleSubmit} className="bg-[#ddd] p-6 rounded-lg shadow-md max-w-md mx-auto">
      <input
        type="text"
        name="username"
        placeholder="Nome de usuário"
        onChange={handleChange}
        required
        className="w-full p-3 mb-4 border border-[#787486] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5030E5]" />
      <input
        type="password"
        name="password"
        placeholder="Senha"
        onChange={handleChange}
        required
        className="w-full p-3 mb-4 border border-[#787486] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5030E5]" />
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
        className="w-full p-3 mb-4 border border-[#787486] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5030E5]" />
      <input
        type="number"
        name="phone_number"
        placeholder="Número de telefone"
        onChange={handleChange}
        required className="w-full p-3 mb-4 border border-[#787486] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5030E5]" />
      <input
        type="text"
        name="is_staff"
        placeholder="staff"
        onChange={handleChange}
        required
        className="w-full p-3 mb-4 border border-[#787486] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5030E5]" />
      <button

        type="submit"
        className="w-full p-3 bg-[#5030E5] text-white rounded-md hover:bg-[#787486] focus:outline-none focus:ring-2 focus:ring-[#5030E5]">Criar Conta</button>
    </form>
  );
}