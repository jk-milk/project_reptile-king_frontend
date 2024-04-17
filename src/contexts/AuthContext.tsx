import { createContext, useReducer, ReactNode } from 'react';

// reducer에 사용할 로그인 현재 상태
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  tokenTime: string | null;
}

// reducer에서 업데이트를 위한 액션 객체
interface AuthAction {
  type: 'LOGIN' | 'LOGOUT';
  token: string | null;
  tokenTime: string | null;
}

// 초기 상태 설정
const getInitialState = (): AuthState => {
  const token = localStorage.getItem('token');
  const tokenTime = localStorage.getItem('tokenTime');
  return {
    isAuthenticated: !!token,
    token: token,
    tokenTime: tokenTime,
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
      localStorage.setItem('token', action.token!);
      localStorage.setItem('tokenTime', action.tokenTime!);
      return {
        ...state,
        isAuthenticated: true,
        token: action.token,
        tokenTime: action.tokenTime,
      };
    }
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('tokenTime');
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        tokenTime: null,
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
