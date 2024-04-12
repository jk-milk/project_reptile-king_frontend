import axios from "axios";
import { API } from "../../config";

// 로그인이 필요한 요청용 axios 인스턴스
const apiWithAuth = axios.create({
  baseURL: API
});

// 인터셉터를 사용해 토큰 추가
apiWithAuth.interceptors.request.use(function(config) {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token ? `${token}` : '';
  console.log(config.headers.Authorization);
  
  return config;
});

// 로그인이 필요하지 않은 요청용 axios 인스턴스
const apiWithoutAuth = axios.create({
  baseURL: API
});

export { apiWithAuth, apiWithoutAuth };
