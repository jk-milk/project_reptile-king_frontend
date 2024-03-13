import { useState } from 'react';

function EmailInput({ onEmailSubmit }: { onEmailSubmit: (email: string) => void }) {
  const [email, setEmail] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onEmailSubmit(email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5">
        <label htmlFor="email" className="block text-white mb-6">가입한 이메일 주소를 입력해 주세요.</label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="flex justify-center mt-16">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-500 disabled:text-gray-300 disabled:border-gray-200 disabled:shadow-none disabled:scale-100 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
        >
          이메일로 인증 코드 받기
        </button>
      </div>
    </form>
  );
}

export default EmailInput;
