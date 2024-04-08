import axios from "axios";
export const instanceAxios = axios.create({
    baseURL: 'https://rbac-backend.onrender.com/',
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin':'*'
      }
  });
