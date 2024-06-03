import axios from "axios";
import { API } from "../../config";

// 로그인이 필요한 요청용 axios 인스턴스
const apiWithAuth = axios.create({
  baseURL: API
});

// 요청 인터셉터
apiWithAuth.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken'); // accessToken 가져오기
    if (token) {
      config.headers['Authorization'] = token; // 요청 헤더에 accessToken 추가
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiWithAuth.interceptors.response.use(
  response => response,
  async error => {
    console.log("에러");

    const originalRequest = error.config;
    console.log(originalRequest);

    // accessToken 만료 시 refreshToken을 사용하여 accessToken 갱신
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      console.log(refreshToken);

      if (refreshToken) {
        // refreshToken을 사용하여 새로운 accessToken 발급
        const oldAccessToken = localStorage.getItem('accessToken');
        console.log('기존 액세스 토큰', oldAccessToken);
        
        try {
          const response = await axios.post(`${API}refresh-token`, {}, {
            headers: {
              'Authorization': refreshToken
            }
          });
          console.log(response);

          const accessToken = response.headers.authorization;
          localStorage.setItem('accessToken', accessToken);
          console.log('갱신된 액세스 토큰', accessToken);
          console.log("요청 재시도");
          return apiWithAuth(originalRequest); // 갱신된 토큰으로 요청 재시도
        } catch (error) {
          console.error("토큰 갱신 실패", error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          alert("다시 로그인해 주세요!")
          return Promise.reject(error);
        }
      }
    }
    return Promise.reject(error);
  }
);

// 로그인이 필요하지 않은 요청용 axios 인스턴스
const apiWithoutAuth = axios.create({
  baseURL: API
});

export { apiWithAuth, apiWithoutAuth };
