import api from "./api";

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export const authService = {
  register: async (data: RegisterData) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },
  login: async (data: LoginData) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },
  activate: async (token: string) => {
    const response = await api.post("/auth/activate", { token });
    return response.data;
  },
  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },
  forgotPassword: async (email: string) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },
  resetPassword: async (token: string, data: any) => {
    const response = await api.post("/auth/reset-password", { token, ...data });
    return response.data;
  },
};
