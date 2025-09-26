import http from "./http-common";

export enum UserRole {
  OWNER = 'owner',
  USER = 'user',
}

export interface User {
  id?: number;
  user_name: string;
  user_lastname: string;
  user_imageUrl?: string;
  user_birth: Date;
  user_role: UserRole;
  tel: string;
  email: string;
  username: string;
  password?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface UpdateUserDto {
  user_name?: string;
  user_lastname?: string;
  user_imageUrl?: string;
  user_birth?: Date;
  user_role?: UserRole;
  tel?: string;
  email?: string;
}

const baseUrl = "api/user";

const getMe = () => {
  return http.get(`${baseUrl}/me`);
};

const getAllUsers = () => {
  return http.get(baseUrl);
};

const getUserById = (id: number) => {
  return http.get(`${baseUrl}/${id}`);
};

const updateUser = (id: number, userData: UpdateUserDto) => {
  return http.patch(`${baseUrl}/${id}`, userData);
};

const deleteUser = (id: number) => {
  return http.delete(`${baseUrl}/${id}`);
};

const userService = {
  getMe,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

export default userService;