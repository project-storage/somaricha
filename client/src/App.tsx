import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";

// Layouts
import MainLayout from "./components/layouts/web/MainLayout";
import AdminLayout from "./components/layouts/admin/AdminLayout";

// Auth Component
import ProtectedRoute from "./components/auth/ProtectedRoute";

// User Pages
import HomePage from "./pages/web/HomePage";
import Aboutme from "./pages/web/Aboutme";
import Menu from "./pages/web/Menu";
import Contact from "./pages/web/Contact";
import Branch from "./pages/web/Branch";
import FAQ from "./pages/web/FAQ";
import Basket from "./pages/web/Basket";
import Profile from "./pages/web/Profile";
import Address from "./pages/web/Adress";
import Payment from "./pages/web/Payment";
import HistoryOrders from "./pages/web/HistoryOrders";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Orders from "./pages/admin/Orders";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";

import "./components/styles/custom.scss";
import ProductPage from "./pages/admin/ProductPage";


function App() {
  return (
    <Router>
      <Routes>
        {/* ================= USER LAYOUT ================= */}
        <Route element={<MainLayout />} >
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<Aboutme />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/branch" element={<Branch />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/basket" element={<Basket />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/address" element={
            <ProtectedRoute>
              <Address />
            </ProtectedRoute>
          } />
          <Route path="/payment" element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          } />
          <Route path="/history-orders" element={
            <ProtectedRoute>
              <HistoryOrders />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* ================= ADMIN LAYOUT ================= */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/products" element={<ProductPage />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
