import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const LogoImag = "/assets/SomariChaLogo.jpg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  const navigate = useNavigate();

  // ตรวจสอบ token และ role จาก localStorage
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

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    setIsLoggedIn(false);
    setRole(null);
    navigate("/");
  };

  return (
    <>
      {/* Navbar บน */}
      <nav className="bg-white px-6 py-4 flex items-center justify-between shadow-md">
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
              {role === "admin" ? (
                <>
                  <li>
                    <Link
                      to="/admin-dashboard"
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
              ) : (
                null
                // <>
                //   <li>
                //     <Link
                //       to="/edit-profile"
                //       onClick={() => setIsMenuOpen(false)}
                //     >
                //       แก้ไขโปรไฟล์
                //     </Link>
                //   </li>
                //   <li>
                //     <Link
                //       to="/address"
                //       onClick={() => setIsMenuOpen(false)}
                //     >
                //       ที่อยู่จัดส่ง
                //     </Link>
                //   </li>
                //   <li>
                //     <Link
                //       to="/payment"
                //       onClick={() => setIsMenuOpen(false)}
                //     >
                //       ช่องทางการชำระเงิน
                //     </Link>
                //   </li>
                //   <li>
                //     <Link
                //       to="/tracking"
                //       onClick={() => setIsMenuOpen(false)}
                //     >
                //       ติดตามการสั่งซื้อ
                //     </Link>
                //   </li>
                //   <li>
                //     <Link
                //       to="/history"
                //       onClick={() => setIsMenuOpen(false)}
                //     >
                //       ประวัติการสั่งซื้อ
                //     </Link>
                //   </li>
                //   <li>
                //     <Link
                //       to="/switch-account"
                //       onClick={() => setIsMenuOpen(false)}
                //     >
                //       สลับบัญชี
                //     </Link>
                //   </li>
                // </>
              )}
              <li>
                <button onClick={logout} className="text-red-600">
                  ออกจากระบบ
                </button>
              </li>
            </>
          ) : (
            <li>
              <button onClick={goToLogin} className="text-black">
                เข้าสู่ระบบ
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Navbar ล่าง */}
      <nav className="bg-black p-4 flex justify-center text-white h-16 shadow-lg">
        <ul className="flex space-x-4 text-[22px] text-white">
          <li>
            <Link to="/" className="hover-effect">
              หน้าหลัก
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover-effect">
              เกี่ยวกับ
            </Link>
          </li>
          <li>
            <Link to="/menu" className="hover-effect">
              สั่งเครื่องดื่ม/เบเกอร์รี่
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover-effect">
              ติดต่อเรา
            </Link>
          </li>
          <li>
            <Link to="/branch" className="hover-effect">
              สาขาใกล้คุณ
            </Link>
          </li>
          <li>
            <Link to="/faq" className="hover-effect">
              คำถามที่พบบ่อย
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
