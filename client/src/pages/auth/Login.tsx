import { useState, useEffect } from "react";
import { FaUser, FaKey, FaFacebook, FaGoogle } from "react-icons/fa";
import authService from "../../services/authService";
import { useNavigate } from "react-router";

interface LoginData {
  username: string;
  password: string;
}

const Login = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  // // Auto-login ถ้ามี token อยู่แล้ว
  // useEffect(() => {
  //   const token = localStorage.getItem("access_token");
  //   const role = localStorage.getItem("user_role");

  //   if (token && role) {
  //     switch (role.toLowerCase()) {
  //       case "owner":
  //         navigate("/admin/dashboard");
  //         break;
  //       case "customer":
  //         navigate("/customer");
  //         break;
  //       default:
  //         navigate("/");
  //     }
  //   }
  // }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginData.username || !loginData.password) {
      alert("กรุณากรอก username และ password");
      return;
    }

    try {
      const res = await authService.login(loginData);
      const { access_token, user_role } = res.data.data;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user_role", user_role);

      switch (user_role) {
        case "owner":
          navigate("/admin/dashboard");
          break;
        case "customer":
          navigate("/customer");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      console.error(error);
      alert("เข้าสู่ระบบล้มเหลว กรุณาลองอีกครั้ง");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-4xl font-bold mb-10">Login</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 w-full max-w-md"
      >
        <div className="relative">
          <FaUser className="absolute left-0 top-1/2 transform -translate-y-1/2 text-black text-xl" />
          <input
            type="text"
            placeholder="Username"
            value={loginData.username}
            onChange={(e) =>
              setLoginData({ ...loginData, username: e.target.value })
            }
            className="pl-10 pb-2 pt-2 w-full border-b-2 border-black focus:border-black outline-none text-lg bg-transparent"
          />
        </div>

        <div className="relative">
          <FaKey className="absolute left-0 top-1/2 transform -translate-y-1/2 text-black text-xl" />
          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            className="pl-10 pb-2 pt-2 w-full border-b-2 border-black focus:border-black outline-none text-lg bg-transparent"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="text-[18px] text-black-500 hover:underline"
          >
            ลืมรหัสผ่าน?
          </button>
        </div>

        <button
          type="submit"
          className="bg-[#8C6E63] hover:bg-[#3E2522] text-white py-3 rounded-[30px] text-lg font-semibold transition-colors shadow-md"
        >
          ยืนยัน
        </button>
      </form>

      <div className="flex items-center my-6 w-full max-w-md">
        <hr className="flex-grow border-gray-300" />
        <span className="px-4 text-gray-500">OR</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <button className="flex items-center justify-center gap-4 h-20 w-full bg-white rounded-[25px] shadow-md text-black text-xl hover:opacity-90 transition">
          <FaFacebook size={28} />
          Sign in with Facebook
        </button>

        <button className="flex items-center justify-center gap-4 h-20 w-full bg-white rounded-[25px] shadow-md text-black text-xl hover:opacity-90 transition">
          <FaGoogle size={28} />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
