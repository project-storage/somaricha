import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { FaUser, FaKey, FaFacebook, FaGoogle } from "react-icons/fa";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(username && password){
      login();          // แจ้ง Context ว่า Login สำเร็จ
      navigate("/");    // กลับหน้าหลัก
    } else {
      alert("กรุณากรอก username และ password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-4xl font-bold mb-10">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-md">
        <div className="relative">
          <FaUser className="absolute left-0 top-1/2 transform -translate-y-1/2 text-black text-xl" />
          <input type="text" placeholder="Username" value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="pl-10 pb-2 pt-2 w-full border-b-2 border-black focus:border-black outline-none text-lg bg-transparent"/>
        </div>
        <div className="relative">
          <FaKey className="absolute left-0 top-1/2 transform -translate-y-1/2 text-black text-xl" />
          <input type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pb-2 pt-2 w-full border-b-2 border-black focus:border-black outline-none text-lg bg-transparent"/>
        </div>
        <div className="text-right">
          <a href="#forgot" className="text-[20px] text-black hover:underline">ลืมรหัสผ่าน</a>
        </div>
        <button type="submit"
          className="bg-[#8C6E63] hover:bg-[#3E2522] text-white py-3 rounded-[30px] text-lg font-semibold transition-colors shadow-md">
          ยืนยัน
        </button>
      </form>
      {/* OR */}
      <div className="flex items-center my-6 w-full max-w-md">
        <hr className="flex-grow border-gray-300" />
        <span className="px-4 text-gray-500">OR</span>
        <hr className="flex-grow border-gray-300" />
      </div>
      {/* Login with Facebook / Google */}
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
