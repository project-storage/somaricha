import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../../context/CartContext";

const LogoImag = "/assets/SomariChaLogo.jpg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const { getTotalItems } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  // ตรวจสอบ token และ role
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("user_role");

    if (token) {
      setIsLoggedIn(true);
      setRole(userRole);
    } else {
      setIsLoggedIn(false);
      setRole(null);
    }
  }, []);

  const goToLogin = () => {
    setIsMenuOpen(false);
    navigate("/login");
  };

  const goToRegister = () => {
    setIsMenuOpen(false);
    navigate("/register");
  };

  const goToBasket = () => {
    navigate("/basket");
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    setIsLoggedIn(false);
    setRole(null);
    navigate("/");
  };

  // Hide cart button when on the basket page
  const isBasketPage = location.pathname === "/basket";

  return (
    <div className="relative w-full overflow-hidden">
      {/* Navbar บน */}
      <nav className="bg-white px-6 py-4 flex items-center justify-between shadow-md w-full box-border">
        <Link to="/" onClick={() => setIsMenuOpen(false)}>
          <img src={LogoImag} alt="Logo" className="h-[120px] cursor-pointer" />
        </Link>
        <button
          className="text-black focus:outline-none"
          onClick={() => setIsMenuOpen(true)}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>

      {/* Hamburger Side Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white text-black z-50 transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out shadow-lg`}
      >
        <div className="flex justify-between items-center p-4">
          <button onClick={() => setIsMenuOpen(false)}>✖</button>
        </div>

        <ul className="flex flex-col p-4 space-y-4 text-lg font-inter">
          {isLoggedIn ? (
            <>
              {role === "owner" && (
                <>
                  <li>
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/manage-orders"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      จัดการออเดอร์
                    </Link>
                  </li>
                </>
              )}
              <li>
                <button onClick={logout} className="text-red-600">
                  ออกจากระบบ
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <button onClick={goToLogin} className="text-black">
                  เข้าสู่ระบบ
                </button>
              </li>
              <li>
                <button onClick={goToRegister} className="text-black">
                  สมัครสมาชิก
                </button>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Navbar ล่าง */}
      <nav className="bg-black p-4 flex justify-center text-white h-16 shadow-lg w-full box-border">
        <ul className="flex space-x-6 text-[22px] text-white">
          <li>
            <Link to="/" className="hover:text-gray-300">
              หน้าหลัก
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-gray-300">
              เกี่ยวกับ
            </Link>
          </li>
          <li>
            <Link to="/menu" className="hover:text-gray-300">
              สั่งเครื่องดื่ม/เบเกอร์รี่
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-gray-300">
              ติดต่อเรา
            </Link>
          </li>
          <li>
            <Link to="/branch" className="hover:text-gray-300">
              สาขาใกล้คุณ
            </Link>
          </li>
          <li>
            <Link to="/faq" className="hover:text-gray-300">
              คำถามที่พบบ่อย
            </Link>
          </li>
        </ul>
      </nav>

      {/* ปุ่มรถเข็น */}
      {!isBasketPage && (
        <button
          onClick={goToBasket}
          className="w-[89px] h-[89px] bg-white rounded-full shadow-lg flex items-center justify-center fixed right-6 bottom-6 z-40 border border-gray-300"
          aria-label="Go to shopping basket"
        >
          <FaShoppingCart className="text-black text-[37px]" />
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-[14px] font-bold">
              {getTotalItems()}
            </span>
          )}
        </button>
      )}
    </div>
  );
};

export default Navbar;
