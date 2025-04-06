import { useState, useEffect } from "react";
import { FiTrello } from "react-icons/fi";
import { PiSquaresFourLight } from "react-icons/pi";
import { RxDoubleArrowLeft } from "react-icons/rx";
import { CiSearch } from "react-icons/ci";
import { RxExit } from "react-icons/rx";



export function Home() {
  const [projects, setProjects] = useState([]);
  const [projectsWithAccounts, setProjectsWithAccounts] = useState([]);
  const [logOut, setLogOut] = useState(false)
  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username')

  useEffect(() => {
    if (!token) {
      window.location.href = '/'
    }
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
  }, [logOut]);

  const exit = () =>{
    localStorage.removeItem('token')   
    setLogOut(true)
  }
  
  useEffect(() => {
    async function fetchAccountsForProjects() {
      if (!projects) return;

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
    <div className="min-h-screen grid grid-cols-[250px_1fr] grid-rows-[70px_1fr_1fr]">
      <aside className="row-span-3 grid grid-rows-[70px_1fr_1fr]">

        {/* Trellio */}
        <div className="flex justify-around items-center border-b-2 border-b-[#DBDBDB]">
          <div className="flex items-center">
            <FiTrello size={40} />
            <h1 className="text-2xl flex justify-center items-center text-center">Trellio</h1>
          </div>
          <RxDoubleArrowLeft size={25} />
        </div>

        {/* Links */}
        <div className="flex flex-col justify-evenly gap-4 p-4 text-black">
          <div className="flex items-center gap-2 ">
            <PiSquaresFourLight size={30} />
            <a href="#" className="hover:text-pink-600">Home</a>
          </div>
          <div className="flex items-center gap-2 ">
            <PiSquaresFourLight size={30} />
            <a href="#" className="hover:text-pink-600">Home</a>
          </div>
          <div className="flex items-center gap-2 ">
            <PiSquaresFourLight size={30} />
            <a href="#" className="hover:text-pink-600">Home</a>
          </div>
          <div className="flex items-center gap-2 ">
            <PiSquaresFourLight size={30} />
            <a href="#" className="hover:text-pink-600">Home</a>
          </div>
          <div className="flex items-center gap-2 ">
            <PiSquaresFourLight size={30} />
            <a href="#" className="hover:text-pink-600">Home</a>
          </div>
        </div>

        {/* Extra content */}
        <div className="p-4 bg-amber-600 text-white">
          <p>asds</p>
        </div>
      </aside>


      <header>
        <div className="flex justify-around items-center h-full">
          <div className="relative">



            <input type="text" placeholder="Seach for a task" className="w-80 bg-white h-10 focus:outline-none focus:bg-violet-100 rounded-xl border-2 border-gray-600" />
            <button className="absolute top-0 right-3 h-full ">
              <CiSearch size={30} bold />
            </button>
          </div>

          <div className="flex items-center">
            <p>Username: {username}</p>
            <RxExit onClick={exit}/>

          </div>
        </div>
      </header>

      <main className="row-span-2">
        <div >
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
      </main>
    </div>
  );
}
