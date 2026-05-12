import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationPage from "./pages/RegistrationPage";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const basename = window.location.hostname.endsWith('github.io') 
    ? window.location.pathname.split('/').slice(0, 2).join('/') 
    : '/';

  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<RegistrationPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
