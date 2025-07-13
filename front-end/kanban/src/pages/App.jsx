import { Routes, Route } from "react-router-dom";
import { Login } from "./Login";
import { Home } from './Home'
import { Register } from "./Register";
import { Project } from "./Project";
import { VerifyResetToken } from "./VerifyResetToken";
import { ResetPassword } from "./ResetPassword";
import { ForgotPassword } from "./ForgotPassword";
import { Settings } from "./Settings";

export default function App() {
  return (
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
  );
}
