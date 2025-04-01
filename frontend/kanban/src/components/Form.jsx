import { useState } from "react";
import {AccountForm} from '../pages/AccountForm'
import {ProjectForm} from '../pages/ProjectForm'
import {ColumnForm} from '../pages/ColumnForm'
import {CardForm} from '../pages/CardForm'

export function Form() {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className="container">
      <h2>Formulário de Criação</h2>

      {/* Navegação entre Formulários */}
      <div className="tabs">
        <button onClick={() => setActiveTab("account")}>Criar Conta</button>
        <button onClick={() => setActiveTab("project")}>Criar Projeto</button>
        <button onClick={() => setActiveTab("column")}>Criar Coluna</button>
        <button onClick={() => setActiveTab("card")}>Criar Card</button>
      </div>

      {activeTab === "account" && <AccountForm />}
      {activeTab === "project" && <ProjectForm />}
      {activeTab === "column" && <ColumnForm />}
      {activeTab === "card" && <CardForm />}
    </div>
  );
}
