import { createContext, useReducer, ReactNode } from 'react';

// reducer에 사용할 로그인 현재 상태
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

// reducer에서 업데이트를 위한 액션 객체
interface AuthAction {
  type: 'LOGIN' | 'LOGOUT';
  token: string | null;
}

// 초기 상태 설정
const getInitialState = (): AuthState => {
  const token = localStorage.getItem('token');
  return {
    isAuthenticated: !!token,
    token: token,
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
    case 'LOGIN':
      console.log(action.token)
      localStorage.setItem('token', action.token!);
      return {
        ...state,
        isAuthenticated: true,
        token: action.token,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        token: null,
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
