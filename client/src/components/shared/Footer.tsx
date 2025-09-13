const LogowhiteImag = "/assets/SomariChawhite.png";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";



const Footer = () => {
  return (
    <footer id="footer" className="bg-black text-white text-center p-6 mt-10">
      {/* Logo */}
      <img src={LogowhiteImag} alt="Logo" className="h-[120px] mx-auto mb-4" />

      {/* Social Media Icons */}
      <div className="flex justify-center space-x-6 mb-4 text-2xl">
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors"
        >
          <FaFacebookF />
        </a>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pink-500 transition-colors"
        >
          <FaInstagram />
        </a>
        <a
          href="https://www.tiktok.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300 transition-colors"
        >
          <FaTiktok />
        </a>
      </div>

      {/* User Links */}
      <div className="flex justify-center flex-wrap gap-6 mb-4 text-lg">
        <a href="#menu" className="hover-effect">เครื่องดื่ม/เบเกอรี่</a>
        <a href="#privacy" className="hover-effect">นโยบายความเป็นส่วนตัว</a>
        <a href="#report"className="hover-effect">แจ้งปัญหาหน้าเว็บ</a>
      </div>

      {/* Contact Info */}
      <p>© 2025 Somari Cha. All rights reserved.</p>
      <p className="mt-2">ติดต่อ: SomariCha@example.com | 081-234-5678</p>
    </footer>
  );
};

export default Footer;
