import { useState } from "react";
import MypageCategory from "../components/Mypage/MypageCategory"

function Profile() {
  const [selectedSubCategory, setSelectedSubCategory] = useState("마이 페이지"); // 선택된 세부 카테고리

  return (
    <div className="laptop:w-[75rem] w-body m-auto flex">
      <MypageCategory selectedSubCategory={selectedSubCategory} setSelectedSubCategory={setSelectedSubCategory} />
      <div className="w-[64.1875rem]">
        <div className="bg-gray-200 px-5 mb-5 rounded h-full">
          
        </div>
      </div>
    </div>
  )
}

export default Profile