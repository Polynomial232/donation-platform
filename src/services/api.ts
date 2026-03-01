import axios from "axios";
import config from "@/lib/config";

const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
