import { useState, useEffect } from "react";
import axios from "axios";

export function App() {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/project/");
        setProjects(res.data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchProjects();
  }, [page]);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/account/`);
        setAccounts(res.data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchAccounts();
  }, []);

  return (
    <>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            {project.name} - {project.members}
          </li>
        ))}
      </ul>
    </>
  );
}
