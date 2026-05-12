import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationPage from "./pages/RegistrationPage";
import Dashboard from "./pages/Dashboard";

export default function App() {
  // Use the basename captured in index.html to handle GitHub Pages subpaths correctly
  const basename = (window as any).__APP_BASENAME__ || "/";
  
  console.log("App Basename:", basename);
  console.log("Current Pathname:", window.location.pathname);

  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<RegistrationPage />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
