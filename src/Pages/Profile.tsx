import { useEffect, useState } from "react";
import MypageCategory from "../components/Mypage/MypageCategory"
import { API } from "../config";
import axios from "axios";

interface userInfo {
  id: number,
  name: string,
  password: string,
  email: string,
  phone: string,
  img_urls: {
    1: string,
  },
  address: {
    1: string,
  },
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
  useEffect(()=>{
    setUserInfo({
      id: userId,
      name: "홍길동",
      password: "axc234fasdff...",
      email: "hong123@gmail.com",
      phone: "010-1111-2222",
      img_urls: {
        1: "http:/...",
      },
      address: {
        1: "경북 칠곡군 ...",
      },
      payment_selection: {
        "1": "...",
      },
      created_at: "2023-12-31 23:23:45",
      updated_at: "2023-12-31 23:50:45"
    })
  },[])
  

  // 로딩 중 처리
  if (!userInfo) {
    return <div>사용자 정보를 불러오는 중...</div>;
  }

  return (
    <div className="laptop:w-[75rem] w-body m-auto flex">
      <MypageCategory selectedSubCategory={selectedSubCategory} setSelectedSubCategory={setSelectedSubCategory} />
      <div className="laptop:w-[64.1875rem] flex flex-col p-8">
        <h2 className="text-xl font-bold mb-4">마이 페이지</h2>
        <div className="flex items-center mb-6">
          <img src={userInfo.img_urls['1']} alt="프로필 사진" className="w-20 h-20 mr-4 rounded-full" />
          <div>
            <h3 className="text-lg font-bold">{userInfo.name}</h3>
            <p>{userInfo.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-bold">가입 날짜:</h4>
            <p>{new Date(userInfo.created_at).toLocaleDateString()}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-bold">배송지:</h4>
            <p>{userInfo.address[1]}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
