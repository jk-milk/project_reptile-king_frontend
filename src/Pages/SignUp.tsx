import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// 이메일 중복 검사 
const emailDuplicateCheck = async (email: string): Promise<boolean> => {
  try {
    const response = await axios.post('http://localhost:8000/api/register/check-email', {
      email,
    });

    // 서버로부터의 응답 메시지에 따라 중복 여부를 반환
    if (response.data.msg === "중복") {
      return false; // 중복일 경우 false 반환
    } else if (response.data.msg === "가능") {
      return true; // 사용 가능할 경우 true 반환
    } else {
      throw new Error('알 수 없는 응답입니다.'); // 에러 처리
    }
  } catch (error) {
    console.error('이메일 중복 검사 중 오류:', error);
    throw new Error('이메일 중복 검사 중 오류');
  }

  // 임시 중복 체크
  // if (email === "test@gmail.com")
  //   return false;
  // return true;
}

const nicknameDuplicateCheck = async (nickname: string): Promise<boolean> => {
  try {
    const response = await axios.post('http://localhost:8000/api/register/check-nickname', {
      nickname,
    });

    // 서버로부터의 응답 메시지에 따라 중복 여부를 반환
    if (response.data.msg === "중복") {
      return false; // 중복일 경우 false 반환
    } else if (response.data.msg === "가능") {
      return true; // 사용 가능할 경우 true 반환
    } else {
      throw new Error('알 수 없는 응답입니다.'); // 에러 처리
    }
  } catch (error) {
    console.error('닉네임 중복 검사 중 오류:', error);
    throw new Error('닉네임 중복 검사 중 오류');
  }

  // 임시 중복 체크
  // if (nickname === "test")
  //   return false;
  // return true;
}

const register = async (name: string, email: string, password: string, password_confirmation:string, nickname:string, phone:string): Promise<boolean> => {
  try {
    console.log(password_confirmation);
    const response = await axios.post('http://localhost:8000/api/register', {
      name,
      email,
      password,
      password_confirmation,
      nickname,
      phone,
    });
    // 회원가입 성공 시
    if (response.status === 201)
      return true;
    else {
      throw new Error('알 수 없는 응답입니다.'); // 에러 처리
    }
  } catch (error) {
    console.error('회원가입:', error);
    throw new Error('회원가입');
  }

  // 임시 회원가입 체크
  // if (email === "test12@gmail.com" && password === "12345678") 
  //   return true;
  // return false;
}

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [nicknameError, setNicknameError] = useState('');

  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);

  const onChangeNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onChangeEmailHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // 이메일 유효성 검사
    const emailRegex = /\S+@\S+\.\S+/;
    if (emailRegex.test(newEmail)) {
      try {
        // 이메일 중복 체크를 비동기로 수행
        const isAvailable = await emailDuplicateCheck(newEmail);
        if (isAvailable) {
          setEmailError(''); // 이메일이 사용 가능한 경우, 에러 메시지를 비우기
          setIsEmailChecked(true);
          setIsEmailAvailable(true);
        } else {
          setEmailError('이미 사용중인 이메일입니다.'); // 이메일이 사용 중인 경우, 에러 메시지를 설정
          setIsEmailChecked(true);
          setIsEmailAvailable(false);
        }
      } catch (error) {
        // 중복 체크 중 에러 발생 시 처리
        setEmailError('이메일 중복 체크 중 오류가 발생했습니다.');
        setIsEmailChecked(false);
      }
    } else {
      setEmailError('유효하지 않은 이메일 주소입니다.'); // 이메일이 유효하지 않은 경우, 에러 메시지를 설정
      setIsEmailChecked(false);
    }
  };

  const onChangePasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === "password") {
      setPassword(value);
      // 비밀번호 변경 시 검증 로직 실행
      validatePassword(value, confirm);
    } else if (id === "confirm") {
      setConfirm(value);
      // 비밀번호 확인 변경 시 검증 로직 실행
      validatePassword(password, value);
    }
  };

  const onChangeNicknameHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value;
    setNickname(newNickname);

    // 닉네임 유효성 검사 (길이 제한)
    if (newNickname.length >= 2 && newNickname.length <= 12) {
      try {
        // 닉네임 중복 체크를 비동기로 수행
        const isAvailable = await nicknameDuplicateCheck(newNickname);
        if (isAvailable) {
          setNicknameError(''); // 닉네임이 사용 가능한 경우, 에러 메시지를 비우기
          setIsNicknameChecked(true);
          setIsNicknameAvailable(true);
        } else {
          setNicknameError('이미 사용중인 닉네임입니다.'); // 닉네임이 사용 중인 경우, 에러 메시지를 설정
          setIsNicknameChecked(true);
          setIsNicknameAvailable(false);
        }
      } catch (error) {
        // 중복 체크 중 에러 발생 시 처리
        setNicknameError('닉네임 중복 체크 중 오류가 발생했습니다.');
        setIsNicknameChecked(false);
      }
    } else {
      setNicknameError('닉네임은 2자 이상 12자 이하로 설정해주세요.'); // 닉네임이 유효하지 않은 경우, 에러 메시지를 설정
      setIsNicknameChecked(false);
    }
  }

  const onChangePhoneNumberHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
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

  const signupHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await register(name, email, password, confirm, nickname, phoneNumber);
    if (response) {
      alert('회원가입 성공!');
      navigate('/login');
    } else {
      alert('회원가입 실패');
      window.location.reload();
    }
  }

  return (
    <div className="flex justify-center py-20">
      <div className="bg-[#284420] laptop:min-w-[49.4rem] laptop:max-w-[49.4rem] min-w-[61.75rem] max-w-[61.75rem] p-10 rounded-md">
        <form onSubmit={signupHandler}>
          <div className="mb-5">
            <label htmlFor="name" className="block text-white mb-2">이름</label>
            <input id="name" name="name" type="text" value={name} required onChange={onChangeNameHandler} className="bg-white border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="mb-5">
            <label htmlFor="email" className="block text-white mb-2">이메일</label>
            <input id="email" name="email" type="email" value={email} required onChange={onChangeEmailHandler} className="bg-white border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" />
            {emailError && <p className="text-red-500">{emailError}</p>}
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="block text-white mb-2">비밀번호</label>
            <input id="password" name="password" type="password" value={password} required onChange={onChangePasswordHandler} className="bg-white border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" />
            {passwordError && <p className="text-red-500">{passwordError}</p>}
          </div>
          <div className="mb-5">
            <label htmlFor="confirm" className="block text-white mb-2">비밀번호 확인</label>
            <input id="confirm" name="password_confirmation" type="password" value={confirm} required onChange={onChangePasswordHandler} className="bg-white border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" />
            {confirmError && <p className="text-red-500">{confirmError}</p>}
          </div>
          <div className="mb-5">
            <label htmlFor="nickname" className="block text-white mb-2">닉네임</label>
            <input id="nickname" name="nickname" type="text" value={nickname} required onChange={onChangeNicknameHandler} className="bg-white border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" />
            {nicknameError && <p className="text-red-500">{nicknameError}</p>}
          </div>
          <div className="mb-5">
            <label htmlFor="phone" className="block text-white mb-2">전화번호</label>
            <input id="phone" name="phone" type="tel" value={phoneNumber} onChange={onChangePhoneNumberHandler} className="bg-white border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="flex justify-center">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-500 disabled:text-gray-300 disabled:border-gray-200 disabled:shadow-none disabled:scale-100 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
              disabled={!isEmailChecked || !isEmailAvailable || password.trim() === '' || password !== confirm || !isNicknameChecked || !isNicknameAvailable}>
              회원가입
            </button>
          </div>
        </form>
        <div className="mt-5 flex justify-center w-full">
          <p className="text-white mr-2">이미 회원인가요?</p>
          <Link to="/login" className="text-blue-500 hover:text-blue-300">로그인</Link>
        </div>
      </div>
    </div>
  )
}

export default Signup;
