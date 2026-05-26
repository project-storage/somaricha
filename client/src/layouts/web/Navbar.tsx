import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../contexts/CartContext";

const LogoImag = "/assets/SomariChaLogo.jpg";

interface NavbarProps {
  hideCartButton?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ hideCartButton: propHideCartButton = false }) => {
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

  // Hide cart button when on certain pages or when prop is true
  const hideCartButton = propHideCartButton || ["/basket", "/login", "/register", "/pay"].includes(location.pathname);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Navbar บน */}
      <nav className="bg-white px-6 py-4 flex items-center justify-between shadow-md w-full box-border">
        <Link to="/" onClick={() => setIsMenuOpen(false)}>
          <img src={LogoImag} alt="Logo" className="h-[60px] md:h-[90px] cursor-pointer transition-all duration-300" />
        </Link>
        <button
          className="text-black focus:outline-none p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
        >
          <svg
            className="w-7 h-7"
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
        } transition-transform duration-300 ease-in-out shadow-lg flex flex-col`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <span className="font-bold text-lg text-[#8C6E63]">เมนูแนะนำ</span>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-xl"
            aria-label="Close menu"
          >
            ✖
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <ul className="flex flex-col space-y-4 text-base font-inter">
            {/* Primary Navigation Links - Mobile/Tablet only */}
            <div className="md:hidden space-y-3 border-b border-gray-100 pb-4 mb-2">
              <span className="text-xs uppercase tracking-wider text-gray-400 font-bold block mb-1">หน้าหลัก</span>
              <li>
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="block py-1 px-2 rounded-lg hover:bg-gray-50 hover:text-[#8C6E63] transition-colors">
                  หน้าหลัก
                </Link>
              </li>
              <li>
                <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block py-1 px-2 rounded-lg hover:bg-gray-50 hover:text-[#8C6E63] transition-colors">
                  เกี่ยวกับ
                </Link>
              </li>
              <li>
                <Link to="/menu" onClick={() => setIsMenuOpen(false)} className="block py-1 px-2 rounded-lg hover:bg-gray-50 hover:text-[#8C6E63] transition-colors">
                  สั่งเครื่องดื่ม/เบเกอร์รี่
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block py-1 px-2 rounded-lg hover:bg-gray-50 hover:text-[#8C6E63] transition-colors">
                  ติดต่อเรา
                </Link>
              </li>
              <li>
                <Link to="/branch" onClick={() => setIsMenuOpen(false)} className="block py-1 px-2 rounded-lg hover:bg-gray-50 hover:text-[#8C6E63] transition-colors">
                  สาขาใกล้คุณ
                </Link>
              </li>
              <li>
                <Link to="/faq" onClick={() => setIsMenuOpen(false)} className="block py-1 px-2 rounded-lg hover:bg-gray-50 hover:text-[#8C6E63] transition-colors">
                  คำถามที่พบบ่อย
                </Link>
              </li>
            </div>

            {/* Account Specific Links */}
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-wider text-gray-400 font-bold block mb-1">บัญชีผู้ใช้</span>
              {isLoggedIn ? (
                <>
                  <li>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-1 px-2 rounded-lg hover:bg-gray-50 hover:text-[#8C6E63] transition-colors"
                    >
                      โปรไฟล์
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/address"
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-1 px-2 rounded-lg hover:bg-gray-50 hover:text-[#8C6E63] transition-colors"
                    >
                      ที่อยู่จัดส่ง
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/payment"
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-1 px-2 rounded-lg hover:bg-gray-50 hover:text-[#8C6E63] transition-colors"
                    >
                      ช่องทางการชำระเงิน
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/order-history"
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-1 px-2 rounded-lg hover:bg-gray-50 hover:text-[#8C6E63] transition-colors"
                    >
                      ประวัติการสั่งซื้อ
                    </Link>
                  </li>
                  {role === "owner" && (
                    <>
                      <li>
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsMenuOpen(false)}
                          className="block py-1 px-2 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors font-medium"
                        >
                          Admin Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/manage-orders"
                          onClick={() => setIsMenuOpen(false)}
                          className="block py-1 px-2 rounded-lg hover:bg-gray-50 hover:text-[#8C6E63] transition-colors"
                        >
                          จัดการออเดอร์
                        </Link>
                      </li>
                    </>
                  )}
                  <li className="pt-2 border-t border-gray-100 mt-2">
                    <button 
                      onClick={logout} 
                      className="w-full text-left py-2 px-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors font-medium"
                    >
                      ออกจากระบบ
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button 
                      onClick={goToLogin} 
                      className="w-full text-left py-2 px-2 rounded-lg hover:bg-gray-50 text-black transition-colors font-medium"
                    >
                      เข้าสู่ระบบ
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={goToRegister} 
                      className="w-full text-left py-2 px-2 rounded-lg bg-[#8C6E63] text-white hover:bg-[#73584F] transition-colors font-medium text-center shadow-sm"
                    >
                      สมัครสมาชิก
                    </button>
                  </li>
                </>
              )}
            </div>
          </ul>
        </div>
      </div>

      {/* Navbar ล่าง */}
      <nav className="bg-black p-4 hidden md:flex justify-center text-white h-13 shadow-lg w-full box-border">
        <ul className="flex space-x-6 text-[18px] text-white">
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
      {!hideCartButton && (
        <button
          onClick={goToBasket}
          className="w-[70px] h-[70px] bg-white rounded-full shadow-lg flex items-center justify-center fixed right-6 bottom-6 z-40 border border-gray-300"
          aria-label="Go to shopping basket"
        >
          <FaShoppingCart className="text-black text-[25px]" />
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
