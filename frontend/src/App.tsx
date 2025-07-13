import { Routes, Route } from "react-router"
import Login from "./pages/auth/Login"
import ForgotPassword from "./pages/auth/ForgotPassword"
import VerifyResetToken from "./pages/auth/VerifiyResetToken"
import ResetPassword from "./pages/auth/ResetPassword"
import { Register } from "./pages/auth/Register"
import { Settings } from "./pages/user_profile/Settings"
import { Home } from './pages/Home'
import { Project } from "./pages/Project"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-reset-token" element={<VerifyResetToken />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />

        <Route path="/settings" element={<Settings />} />

        <Route path="/projects" element={<Home />} />
        <Route path="/project" element={<Project />} />
      </Routes>
    </>
  )
}

export default App
