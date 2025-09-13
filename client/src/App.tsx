import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";  
import Navbar from "./components/shared/Navbar";
import Footer from "./components/shared/Footer";
import HomePage from "./pages/HomePage";
import Aboutme from "./pages/Aboutme";
import Menu from "./pages/Menu";
import Contact from "./pages/Contact";
import Branch from "./pages/Branch";
import FAQ from "./pages/FAQ";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import './components/styles/custom.scss';

function App() {
  return (
    <UserProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/about" element={<Aboutme />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/branch" element={<Branch />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
      <Footer />
    </Router>
     </UserProvider>
  );
}

export default App;
