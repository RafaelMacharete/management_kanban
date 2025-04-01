import { useState, useEffect } from "react";
import { Project } from "../components/Project";
import { Form } from "../components/Form";

export function App() {
  const [projects, setProjects] = useState([]);
  const [projectsWithAccounts, setProjectsWithAccounts] = useState([]);

  // Buscar projetos ao carregar a página
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("http://127.0.0.1:8000/projectboards/");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Erro ao buscar projetos:", err);
      }
    }
    fetchProjects();
  }, []);

  // Buscar contas associadas a todos os projetos
  useEffect(() => {
    async function fetchAccountsForProjects() {
      if (projects.length === 0) return;

      const projectsWithAccountsData = await Promise.all(
        projects.map(async (project) => {
          try {
            const res = await fetch(`http://127.0.0.1:8000/projectboards/${project.id}/accounts/`);
            const accounts = await res.json();
            return { ...project, accounts };
          } catch (err) {
            console.error(`Erro ao buscar contas do projeto ${project.id}:`, err);
            return { ...project, accounts: [] };
          }
        })
      );

      setProjectsWithAccounts(projectsWithAccountsData);
    }

    fetchAccountsForProjects();
  }, [projects]);

  return (
    <>
      <Project projects={projectsWithAccounts} />
      <h1>Gerenciamento de Projetos</h1>
      <Form />
    </>
  );
}
