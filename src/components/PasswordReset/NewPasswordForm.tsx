import { useState } from 'react';

function NewPasswordForm({ onNewPasswordSubmit }: {onNewPasswordSubmit: (password: string, password_confirmation:string) => void}) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const onChangePasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "password") {
      setPassword(value);
      // 비밀번호 변경 시 검증 로직 실행
      validatePassword(value, confirm);
    } else if (name === "confirm") {
      setConfirm(value);
      // 비밀번호 확인 변경 시 검증 로직 실행
      validatePassword(password, value);
    }
  };

  const validatePassword = (password: string, confirm: string) => {
    const passwordRegex = /^[a-z\d!@*&-_]{8,16}$/;
    if (password === '') {
      setPasswordError('비밀번호를 입력해주세요.');
      return;
    } else if (!passwordRegex.test(password)) {
      setPasswordError('비밀번호는 8~16자의 영소문자, 숫자, !@*&-_만 입력 가능합니다.');
      return;
    } else {
      setPasswordError('');
    }

    if (confirm !== password) {
      setConfirmError('비밀번호가 일치하지 않습니다.');
    } else {
      setConfirmError('');
    }
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNewPasswordSubmit(password, confirm);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5">
        <label htmlFor="password" className="block text-white mb-2">새 비밀번호</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={onChangePasswordHandler}
          required
          className="bg-white border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {passwordError && <p className="text-red-500">{passwordError}</p>}
      </div>
      <div className="mb-5">
        <label htmlFor="confirm" className="block text-white mb-2">비밀번호 확인</label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          value={confirm}
          onChange={onChangePasswordHandler}
          required
          className="bg-white border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {confirmError && <p className="text-red-500">{confirmError}</p>}
      </div>
      <div className="flex justify-center mt-16">
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-500 disabled:text-gray-300 disabled:border-gray-200 disabled:shadow-none disabled:scale-100 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">비밀번호 재설정</button>
      </div>
    </form>
  );
}

export default NewPasswordForm;
