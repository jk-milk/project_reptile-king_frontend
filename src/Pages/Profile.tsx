import { useEffect, useRef, useState } from "react";
import MypageCategory from "../components/Mypage/MypageCategory";
import { API } from "../config";
import { apiWithAuth } from "../components/common/axios";
import { MdEdit } from "react-icons/md";
import { UserInfo } from "../types/Profile";
import { Link } from "react-router-dom";

// 테스트 모드 플래그
const TEST_MODE = false;

type EditableFields = 'name' | 'nickname' | 'phone' | 'password';

function Profile() {
  const [selectedSubCategory, setSelectedSubCategory] = useState("マイページ");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isEditing, setIsEditing] = useState<Record<EditableFields, boolean>>({
    name: false,
    nickname: false,
    phone: false,
    password: false,
  });

  const [imageChangeOpen, setImageChangeOpen] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageChangeRef = useRef<HTMLDivElement>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 전화번호 포맷팅 함수
  const formatPhoneNumber = (phoneNumber: string | undefined) => {
    if (!phoneNumber) {
      return '';
    }

    if (phoneNumber.length === 11) {
      return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    return phoneNumber; // 11자리가 아닌 경우 원래 번호 반환
  };

  useEffect(() => {
    if (TEST_MODE) {
      // 테스트 데이터 설정
      setUserInfo({
        nickname: "길동123",
        name: "홍길동",
        password: "axc234fasdff...",
        email: "hong123@gmail.com",
        phone: "01012345678",
        image: "https://search.pstatic.net/sunny/?src=https%3A%2F%2Fcdn2.ppomppu.co.kr%2Fzboard%2Fdata3%2F2022%2F0509%2F20220509173224_d9N4ZGtBVR.jpeg&type=sc960_832",
      });
    } else {
      // 실제 API 호출
      fetchUserInfo().then(setUserInfo).catch(console.error);
    }
  }, []);

  async function fetchUserInfo() {
    try {
      const response = await apiWithAuth.get(`${API}users/show-info`);
      console.log(response);
      return response.data.user;
    } catch (error) {
      console.error('ユーザー情報の取得に失敗しました。', error);
      throw error;
    }
  }

  const handleImageChangeClick = () => {
    setImageChangeOpen(!imageChangeOpen);
  };

  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveImage = async () => {
    if (newImage && userInfo) {
      const formData = new FormData();
      formData.append('newImage', newImage);
      if (userInfo.image) {
        formData.append('beforeImgUrl', userInfo.image);
      } else {
        formData.append('beforeImgUrl', '');
      }
      formData.append('_method', 'PATCH');

      // FormData 내용 확인
      console.log('FormData 내용:');
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, ':', value, '(File)');
        } else {
          console.log(key, ':', value);
        }
      }

      try {
        const response = await apiWithAuth.post(`${API}users/update-image`, formData);
        console.log(response);
      } catch (error) {
        console.error('이미지 업로드 중 오류가 발생했습니다:', error);
        
        alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleCancelImage = () => {
    setNewImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleResetImage = async () => {
    try {
      const formData = new FormData();
      formData.append('beforeImgUrl', userInfo?.image || '');
      formData.append('_method', 'PATCH');

      // FormData 내용 확인
      console.log('FormData 내용:');
      for (const [key, value] of formData.entries()) {
        console.log(key, ':', value);
        console.log(typeof(value));
      }

      const response = await apiWithAuth.post(`${API}users/update-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response);

      if (response.status === 200) {
        setUserInfo(prev => prev ? { ...prev, image: null } : null);
        setImageChangeOpen(false);
        alert('프로필 이미지가 기본 이미지로 변경되었습니다.');
      }
    } catch (error) {
      console.error('이미지 리셋 중 오류가 발생했습니다:', error);
      alert('이미지 리셋에 실패했습니다. 다시 시도해주세요.');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (imageChangeRef.current && !imageChangeRef.current.contains(event.target as Node)) {
        setImageChangeOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEdit = (field: EditableFields) => {
    setIsEditing((prev) => ({ ...prev, [field]: true }));
  };

  const handleSave = async (field: EditableFields) => {
    try {
      let dataToUpdate = {};

      if (field === 'password') {
        if (newPassword !== confirmPassword) {
          alert('새 비밀번호가 일치하지 않습니다.');
          return;
        }
        dataToUpdate = {
          currentPassword,
          password: newPassword
        };
      } else {
        dataToUpdate = { [field]: userInfo?.[field] };
      }

      const response = await apiWithAuth.put(`${API}users/update`, dataToUpdate);
      console.log(response);

      if (response.status === 200) {
        setIsEditing(prev => ({ ...prev, [field]: false }));
        if (field === 'password') {
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          alert('비밀번호가 성공적으로 변경되었습니다.');
        } else {
          alert('정보가 성공적으로 업데이트되었습니다.');
        }
      }
    } catch (error) {
      console.error('저장 중 오류가 발생했습니다:', error);
      alert('정보 업데이트에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    if (field === 'phone') {
      // 전화번호 입력 시 숫자만 허용
      value = value.replace(/[^0-9]/g, '');
    }
    setUserInfo(prev => prev ? { ...prev, [field]: value } : null);
  };

  if (!userInfo) {
    return <div>ユーザー情報を読み込んでいます...</div>;
  }

  return (
    <div className="pt-10 pb-10 laptop:w-[67.5rem] w-body m-auto">
      <div className="bg-white rounded px-5 pt-4 pb-32 mb-4 flex">
        <div className="w-1/4 px-4">
          <MypageCategory
            selectedSubCategory={selectedSubCategory}
            setSelectedSubCategory={setSelectedSubCategory}
          />
        </div>
        <div className="w-3/4 px-4">
          <div className="bg-white rounded px-8 py-4">
            {/* <h2 className="text-2xl font-bold mb-6">회원정보 수정</h2> */}
            <h2 className="text-2xl font-bold mb-6">会員情報の管理</h2>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={previewUrl || userInfo.image || undefined}
                    alt="프로필 사진"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <button
                    onClick={handleImageChangeClick}
                    className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition duration-200"
                  >
                    <MdEdit size={20} color="#4A90E2" />
                  </button>
                  {imageChangeOpen && (
                    <div ref={imageChangeRef} className="absolute top-full right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                      <button onClick={handleImageUpload} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                        写真設定
                      </button>
                      <button onClick={handleResetImage} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                        デフォルト画像に変更
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
                {newImage && (
                  <div className="ml-4 flex items-center">
                    <button
                      onClick={handleSaveImage}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-sm mr-2"
                    >
                      セーブ
                    </button>
                    <button
                      onClick={handleCancelImage}
                      className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-sm"
                    >
                      キャンセル
                    </button>
                  </div>
                )}
                <div className="ml-4">
                  <h3 className="text-xl font-bold">{userInfo?.nickname}</h3>
                  <p className="text-gray-600">{userInfo?.email}</p>
                </div>
              </div>
            </div>
            <table className="w-full border border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="py-4 w-1/4 bg-gray-100 font-semibold pl-4">メールアドレス</td>
                  <td className="py-4 px-4">{userInfo.email}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 w-1/4 bg-gray-100 font-semibold pl-4">名前</td>
                  <td className="py-4 px-4 flex justify-between items-center">
                    {isEditing.name ? (
                      <input
                        type="text"
                        value={userInfo.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="border p-2 flex-grow"
                      />
                    ) : (
                      userInfo.name
                    )}
                    <button
                      onClick={() => isEditing.name ? handleSave('name') : handleEdit('name')}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      {isEditing.name ? 'セーブ' : '名前変更'}
                    </button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 w-1/4 bg-gray-100 font-semibold pl-4">ニックネーム</td>
                  <td className="py-4 px-4 flex justify-between items-center">
                    {isEditing.nickname ? (
                      <input
                        type="text"
                        value={userInfo.nickname}
                        onChange={(e) => handleInputChange('nickname', e.target.value)}
                        className="border p-2 flex-grow"
                      />
                    ) : (
                      userInfo.nickname
                    )}
                    <button
                      onClick={() => isEditing.nickname ? handleSave('nickname') : handleEdit('nickname')}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      {isEditing.nickname ? 'セーブ' : 'ニックネーム変更'}
                    </button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 w-1/4 bg-gray-100 font-semibold pl-4">電話番号</td>
                  <td className="py-4 px-4 flex justify-between items-center">
                    {isEditing.phone ? (
                      <input
                        type="tel"
                        value={userInfo?.phone ?? ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="border p-2 flex-grow"
                        maxLength={11}
                      />
                    ) : (
                      formatPhoneNumber(userInfo?.phone)
                    )}
                    <button
                      onClick={() => isEditing.phone ? handleSave('phone') : handleEdit('phone')}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      {isEditing.phone ? 'セーブ' : '電話番号変更'}
                    </button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 w-1/4 bg-gray-100 font-semibold pl-4">パスワード変更</td>
                  <td className="py-4 px-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="w-1/3 text-sm">現在のパスワード</span>
                        <input
                          type="password"
                          className="border p-2 flex-grow"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center">
                        <span className="w-1/3 text-sm">新しいパスワード</span>
                        <input
                          type="password"
                          className="border p-2 flex-grow"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center">
                        <span className="w-1/3 text-sm">パスワード再入力</span>
                        <input
                          type="password"
                          className="border p-2 flex-grow"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mt-2 text-right">
                      <button
                        onClick={() => handleSave('password')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                      >
                        パスワード変更
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 w-1/4 bg-gray-100 font-semibold pl-4">お支払い方法</td>
                  <td className="py-4 px-4">
                    お支払い方法の管理は <Link to="/mypage/payment" className="text-blue-500 hover:text-blue-700">お支払い方法</Link>で修正・登録できます。
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 w-1/4 bg-gray-100 font-semibold pl-4">アドレス</td>
                  <td className="py-4 px-4">
                    アドレス管理は <Link to="/mypage/address" className="text-blue-500 hover:text-blue-700">アドレス</Link>で修正、登録できます。
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 text-right text-xs">
              <span className="text-gray-500 ">退会をご希望の場合は、右側の退会するボタンを押してください。 </span>
              <button className="bg-gray-500 text-white px-1 pt-1 pb-0.5 rounded transition duration-200">
                退会する
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
