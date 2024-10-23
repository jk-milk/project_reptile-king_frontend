import React, { useState } from 'react';
import MypageCategory from "../components/Mypage/MypageCategory";
import { MdEdit, MdPhone } from 'react-icons/md';

interface AddressInfo {
  postalCode: string;
  prefecture: string;
  city: string;
  street: string;
  phone: string;
}

const MypageDeliveryAddress: React.FC = () => {
  const [selectedSubCategory, setSelectedSubCategory] = useState("マイページ");
  const [addressInfo, setAddressInfo] = useState<AddressInfo>({
    postalCode: "〒480-1163",
    prefecture: "愛知県",
    city: "長久手市",
    street: "原邸無番地",
    phone: "080-1111-2222"
  });

  const handleEdit = () => {
    console.log("주소변경");
  };

  return (
    <div className="pt-10 pb-10 laptop:w-[67.5rem] w-body m-auto">
      <div className="bg-white rounded px-5 py-4 flex">
        <div className="w-1/4 px-4">
          <MypageCategory
            selectedSubCategory={selectedSubCategory}
            setSelectedSubCategory={setSelectedSubCategory}
          />
        </div>
        <div className="w-3/4 px-4">
          <div className="bg-white rounded px-8 py-4">
            {/* <h2 className="text-2xl font-bold mb-6">주소 관리</h2> */}
            <h2 className="text-2xl font-bold mb-6">アドレス</h2>
            <div className="border border-gray-200 rounded-lg p-6 mb-6 relative shadow-md">
              <button 
                onClick={handleEdit}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <MdEdit size={22} />
              </button>
              <p className="font-semibold mb-2">{addressInfo.postalCode}</p>
              <p className="mb-1">{addressInfo.prefecture} {addressInfo.city}</p>
              <p className="mb-3">{addressInfo.street}</p>
              <p className="flex items-center">
                <span className="mr-2">
                  <MdPhone size={18} className="text-gray-500" />
                </span>
                {addressInfo.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MypageDeliveryAddress;