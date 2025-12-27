import React from "react";
import UrlShortener from "./components/UrlForm.jsx";
import Navbar from "./components/Navbar.jsx";
import { Navigate, Route, Routes } from "react-router-dom";
import Docs from "./pages/Docs.jsx";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <Routes>
          <Route path="/" element={<UrlShortener />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;