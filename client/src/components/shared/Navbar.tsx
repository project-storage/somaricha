import { useState } from "react";
import LogoImag from "../../assets/SomariChaLogo.jpg";


const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            {/* Navbar */}
            <nav className="bg-white px-6 py-4 flex items-center justify-between shadow-md">
                {/* Logo */}
                <img src={LogoImag} alt="Logo" className="h-[120px]" />

                {/* Hamburger Button */}
                <button
                    className="text-black focus:outline-none"
                    onClick={() => setIsMenuOpen(true)}
                >
                    <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"   
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
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

            {/* Side Drawer Menu */}
            <div
                className={`fixed top-0 right-0 h-full w-72 bg-white text-black z-50 transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"
                    } transition-transform duration-300 ease-in-out shadow-lg`}
            >
                {/* Header + ปุ่มปิด */}
                <div className="flex justify-between items-center p-4">   
                    <button onClick={() => setIsMenuOpen(false)}>
                        <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Menu List */}
                <ul className="flex flex-col p-4 space-y-4 text-lg font-inter align-items-cent">
                    <li><a href="#Login">เข้าสู่ระบบ</a></li>
                    {/* <li><a href="#edit-profile">แก้ไขโปรไฟล์</a></li>
                    <li><a href="#address">ที่อยู่จัดส่ง</a></li>
                    <li><a href="#payment">ช่องทางการชำระเงิน</a></li>
                    <li><a href="#tracking">ติดตามการสั่งซื้อ</a></li>
                    <li><a href="#history">ประวัติการสั่งซื้อ</a></li>
                    <li><a href="#switch-account">สลับบัญชี</a></li>
                    <li><a href="#logout">ออกจากระบบ</a></li> */}
                </ul>
            </div>

            {/* Navbar ล่าง */}
            <div>
                <nav className="bg-black p-4 flex justify-center text-white h-16 shadow-lg">
                    <ul className="flex space-x-4 text-[22px] text-white ">
                        <li><a href="#home" className="hover-effect">หน้าหลัก</a></li>
                        <li><a href="#about" className="hover-effect">เกี่ยวกับ</a></li>
                        <li><a href="#menu" className="hover-effect">สั่งเครื่องดื่ม/เบเกอร์รี่</a></li>
                        <li><a href="#contact" className="hover-effect">ติดต่อเรา</a></li>
                        <li><a href="#branch" className="hover-effect">สาขาใกล้คุณ</a></li>
                        <li><a href="#faq" className="hover-effect">คำถามที่พบบ่อย</a></li>
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default Navbar;
