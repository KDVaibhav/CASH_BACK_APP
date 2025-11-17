import axios from "axios";

const API_URL = "http://localhost:4000/api";

export const request = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});
