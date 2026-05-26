import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainLayout = () => {
  const location = useLocation();
  const hideCartButton = location.pathname === '/pay';

  return (
    <>
      <Navbar hideCartButton={hideCartButton} />
          <Outlet />
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />
    </>
  );
};

export default MainLayout;
