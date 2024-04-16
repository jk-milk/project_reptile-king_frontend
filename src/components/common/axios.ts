import axios, { AxiosError } from "axios";
import { API } from "../../config";

// 로그인이 필요한 요청용 axios 인스턴스
const apiWithAuth = axios.create({
  baseURL: API
});

// 토큰 갱신 함수
const refreshToken = async (token: string) => {
  try {
    const response = await axios.get(`${API}/refresh-token`, {
      headers: {
        Authorization: token
      }
    });
    // 응답 헤더에서 'Refresh-Token' 값을 가져와 localStorage에 저장
    const refreshToken = response.headers['Refresh-Token'];
    localStorage.setItem('token', refreshToken);
    localStorage.setItem('tokenTime', new Date().getTime().toString()); // 갱신 시간 업데이트
  } catch (error) {
    if (error instanceof AxiosError) {  // Refresh-Token을 받을 수 있는 시간조차 지나서 다시 로그인해야 하는 경우
      console.error(error.response?.data.msg, error);
    } else {
      console.error("알 수 없는 에러 발생", error);
    }
    alert('세션이 곧 만료됩니다. 계속 이용하려면 다시 로그인해주세요.');
  }
};

// 인터셉터를 사용해 토큰 추가
apiWithAuth.interceptors.request.use(async function(config) {
  const token = localStorage.getItem('token'); // accessToken
  const tokenTime = localStorage.getItem('tokenTime'); // 토큰이 처음 저장되었을 때의 시간
  const now = new Date().getTime();

  // 로그인 후 50분이 지났는지 확인
  if (token && tokenTime && (now - parseInt(tokenTime, 10)) > 3000000) { // 3000000ms = 50분
    await refreshToken(token);
    config.headers.Authorization = localStorage.getItem('token'); // 갱신된 토큰으로 설정
  } else { // 로그인 후 50분이 지나지 않은 경우 -> 로컬스토리지의 accessToken을 그대로 사용
    config.headers.Authorization = token; // 기존 토큰으로 설정
  }
  return config;
  }, function(error) {
    return Promise.reject(error);
});

// 로그인이 필요하지 않은 요청용 axios 인스턴스
const apiWithoutAuth = axios.create({
  baseURL: API
});

export { apiWithAuth, apiWithoutAuth };
