import { useState, useEffect } from "react";
import axios from "axios";
import { Project } from '../components/Project'

export function App() {
  const [projects, setProjects] = useState([]);
  const [account, setAccount] = useState('');

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
  }, []);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/account/${variavel}`);
        setAccount(res.data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchAccounts();
  }, [projects]);
  return (
    <>
      <Project projects={projects} account={account}/>
    </>
  );
}
