// pages/Register.tsx
import { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaKey } from "react-icons/fa";
import authService from "../../services/authService";
import { useNavigate } from "react-router";

interface RegisterData {
    username: string;
    email: string;
    tel: string;
    password: string;
    confirmPassword: string;
    agreeTerms: boolean;
}

const Register = () => {
    const [registerData, setRegisterData] = useState<RegisterData>({
        username: "",
        email: "",
        tel: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false,
    });

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // ตรวจสอบฟิลด์
        const { username, email, tel, password, confirmPassword, agreeTerms } =
            registerData;

        if (!username || !email || !tel || !password || !confirmPassword) {
            alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
            return;
        }

        if (password !== confirmPassword) {
            alert("รหัสผ่านไม่ตรงกัน");
            return;
        }

        if (!agreeTerms) {
            alert("กรุณายืนยันข้อตกลง");
            return;
        }

        try {
            await authService.register({ username, email, tel, password });
            alert("สมัครสมาชิกสำเร็จ 🎉");
            navigate("/login");
        } catch (err) {
            console.error(err);
            alert("สมัครสมาชิกไม่สำเร็จ กรุณาลองอีกครั้ง");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
            <h1 className="text-4xl font-bold mb-10">Register</h1>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 w-full max-w-md"
            >
                {/* Username */}
                <div className="relative">
                    <FaUser className="absolute left-0 top-1/2 transform -translate-y-1/2 text-black text-xl" />
                    <input
                        type="text"
                        placeholder="Username"
                        value={registerData.username}
                        onChange={(e) =>
                            setRegisterData({ ...registerData, username: e.target.value })
                        }
                        className="pl-10 pb-2 pt-2 w-full border-b-2 border-black focus:border-black outline-none text-lg bg-transparent"
                    />
                </div>

                {/* Email */}
                <div className="relative">
                    <FaEnvelope className="absolute left-0 top-1/2 transform -translate-y-1/2 text-black text-xl" />
                    <input
                        type="email"
                        placeholder="Email"
                        value={registerData.email}
                        onChange={(e) =>
                            setRegisterData({ ...registerData, email: e.target.value })
                        }
                        className="pl-10 pb-2 pt-2 w-full border-b-2 border-black focus:border-black outline-none text-lg bg-transparent"
                    />
                </div>

                {/* Tel */}
                <div className="relative">
                    <FaPhone className="absolute left-0 top-1/2 transform -translate-y-1/2 text-black text-xl" />
                    <input
                        type="tel"
                        placeholder="Tel"
                        value={registerData.tel}
                        onChange={(e) =>
                            setRegisterData({ ...registerData, tel: e.target.value })
                        }
                        className="pl-10 pb-2 pt-2 w-full border-b-2 border-black focus:border-black outline-none text-lg bg-transparent"
                    />
                </div>

                {/* Password */}
                <div className="relative">
                    <FaKey className="absolute left-0 top-1/2 transform -translate-y-1/2 text-black text-xl" />
                    <input
                        type="password"
                        placeholder="Password"
                        value={registerData.password}
                        onChange={(e) =>
                            setRegisterData({ ...registerData, password: e.target.value })
                        }
                        className="pl-10 pb-2 pt-2 w-full border-b-2 border-black focus:border-black outline-none text-lg bg-transparent"
                    />
                </div>

                {/* Confirm Password */}
                <div className="relative">
                    <FaKey className="absolute left-0 top-1/2 transform -translate-y-1/2 text-black text-xl" />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={registerData.confirmPassword}
                        onChange={(e) =>
                            setRegisterData({
                                ...registerData,
                                confirmPassword: e.target.value,
                            })
                        }
                        className="pl-10 pb-2 pt-2 w-full border-b-2 border-black focus:border-black outline-none text-lg bg-transparent"
                    />
                </div>

                {/* Agree Terms */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={registerData.agreeTerms}
                        onChange={(e) =>
                            setRegisterData({ ...registerData, agreeTerms: e.target.checked })
                        }
                    />
                    <span className="text-lg">
                        ยืนยันข้อตกลงและเงื่อนไข
                    </span>
                </div>

                <button
                    type="submit"
                    className="bg-[#8C6E63] hover:bg-[#3E2522] text-white py-3 rounded-[30px] text-lg font-semibold transition-colors shadow-md"
                >
                    สมัครสมาชิก
                </button>
            </form>
        </div>
    );
};

export default Register;
