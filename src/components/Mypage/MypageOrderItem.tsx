import React, { useState } from 'react';
import { CiShop } from "react-icons/ci";
import { PiPackageLight } from "react-icons/pi";
import { CiDeliveryTruck } from "react-icons/ci";
import { HiOutlineHome } from "react-icons/hi2";

interface Order {
  id: number;
  deliveryStatus: string;
  deliveryStatusMSG: string;
  deliveryDate: string;
  deliveryETA: string;
  productImgUrl: string;
  productName: string;
  productPrice: number;
  productQuantity: number;
  deliveryRequest: string;
}

interface Props {
  order: Order;
  getDayOfWeek: (dateString: string) => string;
}

const MypageOrderItem: React.FC<Props> = ({ order, getDayOfWeek }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="border-2 rounded px-5 py-4 flex items-center justify-between mt-2">
      <div>
        <div className="font-bold text-xl">결제완료</div>
        <div className="text-xl mt-1">
          2024.04.29 (월) 도착예정
        </div>
        <div className="flex items-center mt-2">
          <div>
            <img
              src="https://contents.sixshop.com/uploadedFiles/32210/product/image_1698381407717.jpeg "
              alt={"\"리틀 포레스트\" 크레스티드 게코 아크릴 사육장 20x20x30세트"}
              className="w-16 h-16 rounded-full"
            />
          </div>
          <div className="ml-4 text-lg">
            <div>"리틀 포레스트" 크레스티드 게코 아크릴 사육장 20x20x30세트</div>
            <div className="flex items-center mt-1">
              <div>68,000원</div>
              <div className="ml-3">1개</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <button
          onClick={openModal}
          className="hover:bg-blue-200 text-blue-500 border-2 border-blue-500 font-bold py-1 px-4 rounded mb-2"
        >
          배송조회
        </button>
        <button className="hover:bg-gray-200 border-2 border-gray-400 font-bold py-1 px-4 rounded mb-2">
          교환, 반품신청
        </button>
        <button className="hover:bg-gray-200 border-2 border-gray-400 font-bold py-1 px-4 rounded">
          재구매
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-xl px-8 py-4 z-10 flex flex-col items-center justify-center">

            <div className="border border-black px-5 py-4 text-center">
              <div className="text-2xl font">2024.04.29 도착예정</div>
              <div className="text-xl mb-3">{order.deliveryStatusMSG}</div>
              <div className="flex justify-between text-lg">
                <div className="flex flex-col items-center">
                  <div className="text-3xl bg-blue-500 text-white rounded-full p-1 mb-1">
                    <CiShop />
                  </div>
                  <div className="text-gray-600">결제완료</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl bg-gray-400 text-white rounded-full p-1 mb-1">
                    <PiPackageLight />
                  </div>
                  <div className="text-gray-600">상품준비중</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl bg-gray-400 text-white rounded-full p-1 mb-1">
                    <CiDeliveryTruck />
                  </div>
                  <div className="text-gray-600">배송중</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl bg-gray-400 text-white rounded-full p-1 mb-1">
                    <HiOutlineHome />
                  </div>
                  <div className="text-gray-600">배송완료</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                <div className="bg-green-600 h-2.5 rounded-full w-10"></div>
              </div>
            </div>

            <button onClick={closeModal} className="text-white bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-400 font-bold mt-4">
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MypageOrderItem;
