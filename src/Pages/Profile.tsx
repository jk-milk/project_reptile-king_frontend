import { useEffect, useState } from "react";
import MypageCategory from "../components/Mypage/MypageCategory"
import { API } from "../config";
import axios from "axios";
import { MdOutlineEmail } from "react-icons/md";
import { MdPhoneAndroid } from "react-icons/md";
import { MdOutlineLocationOn } from "react-icons/md";
import { FaUser } from "react-icons/fa";

interface userInfo {
  id: number,
  name: string,
  nickName: string,
  password: string,
  email: string,
  phone: string,
  img_urls: {
    1: string,
  },
  address: string,
  payment_selection: {
    1: string,
  },
  created_at: string,
  updated_at: string,
}

function Profile() {
  const [selectedSubCategory, setSelectedSubCategory] = useState("마이 페이지"); // 선택된 세부 카테고리
  const [userInfo, setUserInfo] = useState<userInfo | null>(null);
  const userId = 1; // 사용자 ID
  const token = localStorage.getItem('token');

  // async function fetchUserInfo(userId: number, token: string) {
  //   try {
  //     const response = await axios.get(`${API}/users/${userId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error('사용자 정보를 불러오는데 실패했습니다.', error);
  //     throw error;
  //   }
  // }

  // useEffect(() => {
  //   fetchUserInfo(userId, token!).then(setUserInfo).catch(console.error);
  // }, [userId, token]);

  // 테스트 코드
  useEffect(() => {
    setUserInfo({
      id: userId,
      nickName: "길동123",
      name: "홍길동",
      password: "axc234fasdff...",
      email: "hong123@gmail.com",
      phone: "010-1234-5678",
      img_urls: {
        1: "https://search.pstatic.net/sunny/?src=https%3A%2F%2Fcdn2.ppomppu.co.kr%2Fzboard%2Fdata3%2F2022%2F0509%2F20220509173224_d9N4ZGtBVR.jpeg&type=sc960_832",
      },
      address: "경상북도 칠곡군 지천면 금송로 60 글로벌캠퍼스 A동",
      payment_selection: {
        "1": "...",
      },
      created_at: "2023-12-31 23:23:45",
      updated_at: "2023-12-31 23:50:45"
    })
  }, [])


  // 로딩 중 처리
  if (!userInfo) {
    return <div>사용자 정보를 불러오는 중...</div>;
  }

  return (
    <div className="pt-12 pb-24 mx-auto max-w-screen-xl flex">
      {/* 왼쪽 섹션 */}
      <div className="w-1/4 px-4">
        <MypageCategory
          selectedSubCategory={selectedSubCategory}
          setSelectedSubCategory={setSelectedSubCategory}
        />
      </div>

      {/* 오른쪽 섹션 */}
      <div className="w-3/4 px-4">
        <div className="bg-gray-200 rounded px-8 py-4">
          <div className="flex items-center mt-8 mb-12">
            <img src={userInfo.img_urls['1']} alt="프로필 사진" className="w-40 h-40 mr-4 rounded-full" />
            <div>
              <div className="flex items-center">
                <h3 className="text-2xl font-bold mr-2">{userInfo.nickName}</h3>
              </div>
              <div className="flex items-center">
                <h3 className="text-xl "><FaUser /></h3>
                <h3 className="text-lg ml-2">{userInfo.name}</h3>
              </div>
              <div className="flex items-center">
                <h3 className="text-xl"><MdOutlineEmail /></h3>
                <h3 className="text-lg ml-2">{userInfo.email}</h3>
              </div>
              <div className="flex items-center">
                <h3 className="text-xl "><MdPhoneAndroid /></h3>
                <h3 className="text-lg ml-2">{userInfo.phone}</h3>
              </div>
              <div className="flex items-center">
                <h3 className="text-xl"><MdOutlineLocationOn /></h3>
                <h3 className="text-lg ml-2">{userInfo.address}</h3>
              </div>
            </div>
          </div>

          <div className="font-bold text-2xl mb-3">결제수단</div>
          <div className="bg-white rounded flex items-center px-5 py-4 mb-10">
            <div>
              <h3 className="text-xl font-bold">배송지 별명</h3>
              <h3 className="text-lg font-bold">{userInfo.address}</h3>
              <div className="flex items-center">
                <h3 className="text-lg mr-3">{userInfo.name}</h3>
                <h3 className="text-lg">{userInfo.phone}</h3>
              </div>
            </div>
          </div>

          <div className="font-bold text-2xl mb-3">배송지</div>
          <div className="bg-white rounded flex items-center px-5 py-4 mb-5">
            <div>
              <h3 className="text-xl font-bold">배송지 별명</h3>
              <h3 className="text-lg font-bold">{userInfo.address}</h3>
              <div className="flex items-center">
                <h3 className="text-lg mr-3">{userInfo.name}</h3>
                <h3 className="text-lg">{userInfo.phone}</h3>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile
