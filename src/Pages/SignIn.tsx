import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { API } from '../config';
import { apiWithoutAuth } from '../components/common/axios';
import { isAxiosError } from 'axios';
import { getNotificationToken } from '../services/notificationToken';

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
      // 푸시 알림 토큰 가져오기
      const notificationToken = await getNotificationToken();
      // 서버로 로그인 요청
      const response = await apiWithoutAuth.post(API+'login', {
        email,
        password,
        notificationToken,
        platform: "web",
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
      alert('ログインできました！');
      navigate("/");

    } catch (error) {
      if (isAxiosError(error)) { // error instanceof AxiosError 
        setLoginError('メールアドレスまたはパスワードを間違えて入力しました。 入力内容を再確認してください。');
        console.error(error);
        alert('メールアドレスまたはパスワードを間違えて入力しました。 入力内容を再確認してください。');
      } else { 
        // error가 Error 타입이 아닐 때의 처리
        console.error(error);
        setLoginError('알 수 없는 에러가 발생했습니다.');
      }
    }
  }

  return (
    <div className="flex justify-center py-20">
      <div className="bg-[#284420] laptop:min-w-[30rem] laptop:max-w-[30rem] min-w-[35rem] max-w-[35rem] p-10 rounded-md">
        <form onSubmit={loginHandler}>
          <div className="mb-5">
            <label htmlFor="email" className="block text-white mb-2">メールアドレス</label>
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
            <label htmlFor="password" className="block text-white mb-2">パスワード</label>
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
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline">ログイン</button>
          </div>
        </form>
        <div className="mt-12 flex justify-center w-full">
          <div className="grid grid-cols-2 gap-4 ml-20">
            <p className="text-white mr-2">会員登録されていない方</p>
            <Link to="/signup" className="text-blue-500 hover:text-blue-300">会員登録</Link>
            <p className="text-white mr-2">パスワードを忘れた場合</p>
            <Link to="/reset-password" className="text-blue-500 hover:text-blue-300">
            パスワードの再設定</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
