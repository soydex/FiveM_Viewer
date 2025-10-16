import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
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
    <I18nextProvider i18n={i18n}>
      <AppContent />
    </I18nextProvider>
  );
}