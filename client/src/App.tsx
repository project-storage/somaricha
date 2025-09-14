import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';

// Layouts
import MainLayout from './components/layouts/web/MainLayout';
import AdminLayout from './components/layouts/admin/AdminLayout';

// User Pages
import HomePage from './pages/web/HomePage';
import Aboutme from './pages/web/Aboutme';
import Menu from './pages/web/Menu';
import Contact from './pages/web/Contact';
import Branch from './pages/web/Branch';
import FAQ from './pages/web/FAQ';
import Login from './pages/auth/Login';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Orders from './pages/admin/Orders';
import Analytics from './pages/admin/Analytics';
import Settings from './pages/admin/Settings';

import './components/styles/custom.scss';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* ================= USER LAYOUT ================= */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<Aboutme />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/branch" element={<Branch />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* ================= ADMIN LAYOUT ================= */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />        {/* /admin */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="orders" element={<Orders />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
