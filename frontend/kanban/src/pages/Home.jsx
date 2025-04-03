import { useState, useEffect } from "react";
import { Form } from "../components/Form";

export function Home() {
  const [projects, setProjects] = useState([]);
  const [projectsWithAccounts, setProjectsWithAccounts] = useState([]);

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
    <div className="p-6 bg-gray-100 min-h-screen">
      <Form></Form>
      <h1 className="text-3xl font-bold mb-6 text-center">Gerenciamento de Projetos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectsWithAccounts.map((project) => (
          <div key={project.id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
            <h3 className="text-lg font-medium text-gray-700">Usuários:</h3>
            <ul className="list-disc pl-5">
              {project.accounts.length > 0 ? (
                project.accounts.map((user) => (
                  <li key={user.id} className="text-gray-600">{user.username}</li>
                ))
              ) : (
                <li className="text-gray-400">Nenhum usuário associado</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
