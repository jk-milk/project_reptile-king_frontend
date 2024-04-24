import { createContext, useReducer, ReactNode } from 'react';

// reducer에 사용할 로그인 현재 상태
interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

// reducer에서 업데이트를 위한 액션 객체
export interface AuthAction {
  type: 'LOGIN' | 'LOGOUT';
  accessToken: string | null;
  refreshToken: string | null;
}

// 초기 상태 설정
const getInitialState = (): AuthState => {
  const token = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  return {
    isAuthenticated: !!token,
    accessToken: token,
    refreshToken: refreshToken,
  };
};

export const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}>({
  state: getInitialState(),
  dispatch: () => null,
});

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':{
      localStorage.setItem('accessToken', action.accessToken!);
      localStorage.setItem('refreshToken', action.refreshToken!);
      return {
        ...state,
        isAuthenticated: true,
        accessToken: action.accessToken,
        refreshToken: action.refreshToken,
      };
    }
    case 'LOGOUT':
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return {
        ...state,
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode })  => {
  const [state, dispatch] = useReducer(authReducer, getInitialState());

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
