import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CountryPage from "./pages/CountryPage";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Country Info Explorer</h1>
        <ThemeToggle />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/country/:code" element={<CountryPage />} />
        </Routes>
      </main>
      <footer className="footer">Built with React + Flask</footer>
    </div>
  );
}
