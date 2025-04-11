import { Routes, Route } from "react-router-dom";
import { Login } from "./Login";
import { Home } from './Home'
import { Register } from "./Register";
import { Project } from "./Project";

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/projects" element={<Home />} />
        <Route path='/project' element={<Project />} />
      </Routes>
  );
}
