import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationPage from "./pages/RegistrationPage";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegistrationPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
