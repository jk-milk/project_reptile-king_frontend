import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function VerificationCodeInput({ onCodeSubmit }: { onCodeSubmit: (code: string) => void }) {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(180); // 180초 (3분) 제한으로 시작

  useEffect(() => {
    // 타이머가 0보다 클 때만 동작
    if (timer > 0) {
      // 1초마다 timer를 1씩 줄임
      const countdown = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);

      // 컴포넌트가 언마운트 되거나 타이머가 0에 도달하면 타이머 클리어
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  // 분과 초를 계산
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (timer > 0) {
      onCodeSubmit(code);
    } else {
      alert('인증 코드의 유효 시간이 만료되었습니다. 다시 시도해주세요.');
      navigate("/login");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5">
        <label htmlFor="code" className="block text-white mb-6">이메일로 받은 인증코드를 입력해 주세요. </label>
        <div className="relative">
          <input
            id="code"
            type="text"
            value={code}
            required
            onChange={(e) => setCode(e.target.value)}
            className="bg-white border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-red-500">
            {timer > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : '시간 초과. 다시 시도해 주세요.'} {/*초가 한 자릿수일 경우 앞에 0을 붙여 두 자릿수로 표시*/}
          </span>
        </div>
      </div>
      <div className="flex justify-center mt-16">
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-500 disabled:text-gray-300 disabled:border-gray-200 disabled:shadow-none disabled:scale-100 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">
          비밀번호 재설정하기
        </button>
      </div>
    </form>
  );
}

export default VerificationCodeInput;
