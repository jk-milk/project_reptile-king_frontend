import axios from "axios";
import { API } from "../../config";

// 로그인이 필요한 요청용 axios 인스턴스
const apiWithAuth = axios.create({
  baseURL: API
});

// 인터셉터를 사용해 토큰 추가
apiWithAuth.interceptors.request.use(function(config) {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token ? token : '';
  return config;
});

// 응답 인터셉터를 추가하여 갱신된 토큰 처리 및 재로그인 요청
apiWithAuth.interceptors.response.use(function(response) {
  // accessToken이 만료되어 서버로부터 응답 헤더에 'refreshToken'이 있으면 로컬 스토리지 업데이트
  const refreshToken = response.headers['refreshToken'];
  if (refreshToken) {
    localStorage.setItem('token', refreshToken);
  }
  return response;
}, function(error) {
  if (error.response && error.response.status === 401) {
    // 서버로부터의 응답 메시지 확인
    const errorMessage = error.response.data.msg;
    if (errorMessage === '유효하지 않은 토큰') {
      console.error('인증 실패: 토큰이 유효하지 않습니다.');
    } else if (errorMessage === '토큰을 재발급 불가. 재발급 기간 만료, 다시 로그인해 보세요.') {
      // 사용자에게 재로그인이 필요하다는 것을 알림
      alert('세션이 만료되었습니다. 다시 로그인해주세요.');
      // 로그인 페이지로 리다이렉트
      location.replace("/login");
    }
  }
  return Promise.reject(error);
});

// 로그인이 필요하지 않은 요청용 axios 인스턴스
const apiWithoutAuth = axios.create({
  baseURL: API
});

export { apiWithAuth, apiWithoutAuth };
