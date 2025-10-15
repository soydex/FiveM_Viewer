import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { useEffect } from "react";
import Origin from "./pages/Origin";
import Terms from "./pages/Terms";

const AppContent = () => {

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    document.documentElement.classList.add("dark", theme || "dark");
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Origin />
          }
        />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<Origin />} />
      </Routes>
    </Router>
  );
};


export default function App() {
  return (
      <AppContent />
  );
}