// pages/Register.tsx
import { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaKey, FaEye, FaEyeSlash } from "react-icons/fa";
import authService from "../../services/authService";
import { useNavigate } from "react-router";

interface RegisterData {
    username: string;
    email: string;
    user_name: string;
    user_lastname: string;
    tel: string; // Keep tel if it's needed for phone number, otherwise we can remove it
    password: string;
    confirmPassword: string;
    agreeTerms: boolean;
}

const Register = () => {
    const [registerData, setRegisterData] = useState<RegisterData>({
        username: "",
        email: "",
        user_name: "",
        user_lastname: "",
        tel: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false,
    });

    const navigate = useNavigate();
    
    // State for password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // ตรวจสอบฟิลด์
        const { username, email, user_name, user_lastname, tel, password, confirmPassword, agreeTerms } =
            registerData;

        if (!username || !email || !user_name || !user_lastname || !password || !confirmPassword) {
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
            await authService.register({ 
                username, 
                password, 
                user_name, 
                user_lastname, 
                email 
            });
            alert("สมัครสมาชิกสำเร็จ 🎉");
            navigate("/login");
        } catch (err: any) {
            console.error("Registration error:", err);
            // Try to get error message from response
            const errorMessage = err.response?.data?.message || "สมัครสมาชิกไม่สำเร็จ กรุณาลองอีกครั้ง";
            alert(errorMessage);
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

                {/* First Name */}
                <div className="relative">
                    <FaUser className="absolute left-0 top-1/2 transform -translate-y-1/2 text-black text-xl" />
                    <input
                        type="text"
                        placeholder="First Name"
                        value={registerData.user_name}
                        onChange={(e) =>
                            setRegisterData({ ...registerData, user_name: e.target.value })
                        }
                        className="pl-10 pb-2 pt-2 w-full border-b-2 border-black focus:border-black outline-none text-lg bg-transparent"
                    />
                </div>

                {/* Last Name */}
                <div className="relative">
                    <FaUser className="absolute left-0 top-1/2 transform -translate-y-1/2 text-black text-xl" />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={registerData.user_lastname}
                        onChange={(e) =>
                            setRegisterData({ ...registerData, user_lastname: e.target.value })
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
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={registerData.password}
                        onChange={(e) =>
                            setRegisterData({ ...registerData, password: e.target.value })
                        }
                        className="pl-10 pr-10 pb-2 pt-2 w-full border-b-2 border-black focus:border-black outline-none text-lg bg-transparent"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-black text-xl"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                    <FaKey className="absolute left-0 top-1/2 transform -translate-y-1/2 text-black text-xl" />
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={registerData.confirmPassword}
                        onChange={(e) =>
                            setRegisterData({
                                ...registerData,
                                confirmPassword: e.target.value,
                            })
                        }
                        className="pl-10 pr-10 pb-2 pt-2 w-full border-b-2 border-black focus:border-black outline-none text-lg bg-transparent"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-black text-xl"
                    >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
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
