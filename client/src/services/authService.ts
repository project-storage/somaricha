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

const login = (LoginData: LoginData) => {
  return http.post(`${baseUrl}/login`, LoginData);
};

const register = (RegisterData: RegisterData) => {
  return http.post(`${baseUrl}/register`, RegisterData);
};

const authService = {
  login,
  register,
};

export default authService;
