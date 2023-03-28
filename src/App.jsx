import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import Simulation from "./pages/simulation/Simulation";
import Marketplace from "./pages/marketplace/Marketplace";
import Results from "./pages/results/Results";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </Navbar>
    </BrowserRouter>
  );
}
