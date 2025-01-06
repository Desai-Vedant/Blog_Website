import Home from "../components/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../components/LoginPage";
import RegisterPage from "../components/RegisterPage";
import MenuAppBar from "../components/MenuAppBar";
import "./App.css";

function App() {
  return (
    <div>
      <Router>
        <MenuAppBar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<h2>Dashboard</h2>} />
          <Route path="/profile" element={<h2>Profile</h2>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
