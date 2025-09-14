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

const baseUrl = 'api/'

