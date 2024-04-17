import axios, { AxiosError } from "axios";
import { API } from "../../config";
import { useAuth } from "../../hooks/useAuth";

interface AuthAction {
  type: 'LOGIN' | 'LOGOUT';
  token: string | null;
  tokenTime: string | null;
}

// 로그인이 필요한 요청용 axios 인스턴스
const apiWithAuth = axios.create({
  baseURL: API
});

// 토큰 갱신 함수
const refreshToken = async (token: string, dispatch: React.Dispatch<AuthAction>) => {  
  try {
    const response = await axios.post(`${API}refresh-token`, {}, {
      headers: {
        Authorization: token
      }
    });    
    // 응답 헤더에서 'Refresh-Token' 값을 가져와 localStorage에 저장
    const refreshToken = response.headers['Refresh-Token'];
    localStorage.setItem('token', refreshToken);
    localStorage.setItem('tokenTime', new Date().getTime().toString()); // 갱신 시간 업데이트    
  } catch (error) {
    if (error instanceof AxiosError) {  // Refresh-Token을 받을 수 있는 시간이 지나서 다시 로그인해야 하는 경우
      console.error(error.response?.data.msg, error);
      dispatch({ type: 'LOGOUT', token: null, tokenTime: null });
      alert('세션이 만료되었습니다. 다시 로그인해 주세요.');
      location.replace("/");
    } else {
      console.error("알 수 없는 에러 발생", error);
      alert("알 수 없는 에러 발생");
    }
  }
};

// 인터셉터를 사용해 토큰 추가
apiWithAuth.interceptors.request.use(async function(config) {
  const { state, dispatch } = useAuth();
  const token = state.token;
  const tokenTime = state.tokenTime; // 토큰이 처음 저장되었을 때의 시간
  const now = Date.now();
  // console.log(token);
  
  // 로그인 후 50분이 지났는지 확인
  if (token && tokenTime && (now - parseInt(tokenTime, 10)) > 10000) { // 3000000ms = 50분
    await refreshToken(token, dispatch);
    config.headers.Authorization = state.token; // 갱신된 토큰으로 설정
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
