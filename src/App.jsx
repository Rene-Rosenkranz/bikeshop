import "./App.css";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import Simulation from "./pages/simulation/Simulation";
import Marketplace from "./pages/marketplace/Marketplace";
import Results from "./pages/results/Results";
import FileUpload from "./pages/fileupload/FileUpload";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/results" element={<Results />} />
          <Route path="/upload" element={<FileUpload />} />
        </Routes>
      </div>
    </>
  );
}
