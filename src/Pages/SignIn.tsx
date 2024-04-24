import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { API } from '../config';
import { apiWithoutAuth } from '../components/common/axios';
import { isAxiosError } from 'axios';

function SignIn() {

  const navigate = useNavigate();
  const { dispatch } = useAuth();
  // 상태 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // 이메일과 비밀번호 입력 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // 서버로 로그인 요청
      const response = await apiWithoutAuth.post(API+'login', {
        email,
        password,
      });
      console.log(response);

      // 로그인 성공 시, JWT 토큰 저장
      const accessToken = response.headers['authorization'];
      const refreshToken = response.headers['refresh-token'];
      console.log(refreshToken);

      dispatch({ 
        type: 'LOGIN',
        accessToken,
        refreshToken,
      });

      // 로그인 성공 후 로직 처리
      setEmail('');
      setPassword('');
      setLoginError('');
      alert('로그인 성공!');
      navigate(-1);

    } catch (error) {
      if (isAxiosError(error)) { // error instanceof AxiosError 
        setLoginError('이메일 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.');
        console.error(error);
        alert('이메일 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.');
      } else { 
        // error가 Error 타입이 아닐 때의 처리
        setLoginError('알 수 없는 에러가 발생했습니다.');
      }
    }
  }

  return (
    <div className="flex justify-center py-20">
      <div className="bg-[#284420] laptop:min-w-[30rem] laptop:max-w-[30rem] min-w-[35rem] max-w-[35rem] p-10 rounded-md">
        <form onSubmit={loginHandler}>
          <div className="mb-5">
            <label htmlFor="email" className="block text-white mb-2">이메일</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={handleInputChange}
              required
              className="bg-white border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="block text-white mb-2">비밀번호</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={handleInputChange}
              required
              className="bg-white border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {loginError && <p className="text-red-500">{loginError}</p>}
          <div className="flex justify-center">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline">로그인</button>
          </div>
        </form>
        <div className="mt-12 flex justify-center w-full">
          <div className="grid grid-cols-2 gap-4 ml-20">
            <p className="text-white mr-2">계정이 없나요?</p>
            <Link to="/signup" className="text-blue-500 hover:text-blue-300">회원가입!</Link>
            <p className="text-white mr-2">비밀번호를 잊으셨나요?</p>
            <Link to="/reset-password" className="text-blue-500 hover:text-blue-300">비밀번호 재설정!</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
