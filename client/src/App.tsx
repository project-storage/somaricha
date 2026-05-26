import { BrowserRouter as Router, Routes, Route } from "react-router";
import { lazy, Suspense } from "react";

// Layouts
import MainLayout from "./layouts/web/MainLayout";
import AdminLayout from "./layouts/admin/AdminLayout";

// User Pages
const HomePage = lazy(() => import("./pages/web/HomePage"));
const Aboutme = lazy(() => import("./pages/web/Aboutme"));
const Menu = lazy(() => import("./pages/web/Menu"));
const Contact = lazy(() => import("./pages/web/Contact"));
const Branch = lazy(() => import("./pages/web/Branch"));
const FAQ = lazy(() => import("./pages/web/FAQ"));
const Basket = lazy(() => import("./pages/web/Basket"));
const Profile = lazy(() => import("./pages/web/Profile"));
const Address = lazy(() => import("./pages/web/Address"));
const AddAddress = lazy(() => import("./pages/web/AddAddress"));
const EditAddress = lazy(() => import("./pages/web/EditAddress"));
const Payment = lazy(() => import("./pages/web/Payment"));
const Pay = lazy(() => import("./pages/web/Pay"));
const OrderHistory = lazy(() => import("./pages/web/OrderHistory"));
const OrderDetail = lazy(() => import("./pages/web/OrderDetail"));
const AdminCompletedOrders = lazy(() => import("./pages/admin/CompletedOrders"));

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));

// Admin Pages
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Users = lazy(() => import("./pages/admin/Users"));
const Orders = lazy(() => import("./pages/admin/Orders"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const Payments = lazy(() => import("./pages/admin/Payments"));
const Addresses = lazy(() => import("./pages/admin/Addresses"));
const AddressOptions = lazy(() => import("./pages/admin/AddressOptions"));
const ProductPage = lazy(() => import("./pages/admin/ProductPage"));

import "./components/styles/custom.scss";

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-[#8C6E63] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 font-semibold text-lg animate-pulse">Somaricha Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
        {/* Public Routes - No Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= USER LAYOUT ================= */}
        <Route element={<MainLayout />} >
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<Aboutme />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/branch" element={<Branch />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/basket" element={<Basket />} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/address" element={<Address />} />
          <Route path="/address/add" element={<AddAddress />} />
          <Route path="/address/edit/:id" element={<EditAddress />} />
          <Route path="/payment" element={<Payment/>} />
          <Route path="/pay" element={<Pay />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/order-detail/:id" element={<OrderDetail />} />
        </Route>

        {/* ================= ADMIN LAYOUT ================= */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/products" element={<ProductPage />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/completed-orders" element={<AdminCompletedOrders />} />
          <Route path="/admin/payments" element={<Payments />} />
          <Route path="/admin/addresses" element={<Addresses />} />
          <Route path="/admin/address-options" element={<AddressOptions />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/settings" element={<Settings />} />
        </Route>
      </Routes>
     </Suspense>
    </Router>
  );
}

export default App;
