import http from "./http-common";

interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  password: string;
  user_name: string;
  user_lastname: string;
  email: string;
}

const baseUrl = "api/auth";

const login = (loginData: LoginData) =>
  http.post(`${baseUrl}/login`, loginData);
const register = (registerData: RegisterData) =>
  http.post(`${baseUrl}/register`, registerData);
const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_role");
};

const authService = { login, register, logout };

export default authService;
