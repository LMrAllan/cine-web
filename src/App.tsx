import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Filmes from "./pages/Filmes";
import Salas from "./pages/Salas";
import Sessoes from "./pages/Sessoes";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/filmes" element={<Filmes />} />
        <Route path="/salas" element={<Salas />} />
        <Route path="/sessoes" element={<Sessoes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
