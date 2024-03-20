import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmailInput from '../components/PasswordReset/EmailInput';
import VerificationCodeInput from '../components/PasswordReset/VerificationCodeInput';
import NewPasswordForm from '../components/PasswordReset/NewPasswordForm';

function PasswordResetPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const handleEmailSubmit = async (email: string) => {
    setEmail(email);
    try {
      // 서버에 이메일 전송, 인증코드 요청 로직
      setStep(2); // 성공 시 다음 단계
    } catch (error) {
      alert('이메일 인증 코드 요청에 실패했습니다. 다시 시도해주세요.'); // 실패 시 알림
    }
  };

  const handleCodeSubmit = async (code: string) => {
    setVerificationCode(code);
    try {
      // 인증 코드 확인 로직
      setStep(3); // 성공 시 다음 단계
    } catch (error) {
      alert('인증 코드 확인에 실패했습니다. 다시 시도해주세요.'); // 실패 시 알림
    }
  };
  
  const handleNewPasswordSubmit = async (password: string) => {
    try {
      // 새 비밀번호 설정 로직
      alert('비밀번호 재설정 완료. 로그인 페이지로 이동합니다.'); 
      navigate('/login'); // 성공 시 알림 띄우고 로그인 페이지로 이동
    } catch (error) {
      alert('비밀번호 재설정에 실패했습니다. 다시 시도해주세요.'); // 실패 시 알림
    }
  };
  

  return (
    <div className="flex justify-center py-20">
      <div className="bg-[#284420] min-w-[61.75rem] max-w-[61.75rem] p-10 rounded-md">
        {step === 1 && <EmailInput onEmailSubmit={handleEmailSubmit} />}
        {step === 2 && <VerificationCodeInput onCodeSubmit={handleCodeSubmit} />}
        {step === 3 && <NewPasswordForm onNewPasswordSubmit={handleNewPasswordSubmit} />}
      </div>
    </div>
  );
}

export default PasswordResetPage;
