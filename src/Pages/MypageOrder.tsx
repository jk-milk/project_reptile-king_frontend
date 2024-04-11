import { useState } from 'react';
import MypageCategory from '../components/Mypage/MypageCategory';
import { IoIosArrowForward } from 'react-icons/io';
import MypageOrderItem from '../components/Mypage/MypageOrderItem';
import { Link } from 'react-router-dom';
import { API } from '../config';
import axios from 'axios';

export const orders = [
  {
    id: 1,
    deliveryStatus: '배송중',
    deliveryStatusMSG: '고객님께서 주문하신 상품이 배송중입니다.',
    deliveryDate: '2023.01.29',
    deliveryETA: '2023.01.31',
    productImgUrl: 'https://via.placeholder.com/150',
    productName: '크레 슈퍼푸드 도마뱀 사료',
    productPrice: 24090,
    productQuantity: 1,
    paymentMethod : "국민은행",
    receiverName: "배석민",
    receiverPhone: "010-3891-5626",
    receiverAddress : "(39866) 경상북도 칠곡군 지천면 금송로 60 글로벌캠퍼스 A동",
    deliveryRequest : "그 외 장소",
  },
  {
    id: 2,
    deliveryStatus: '배송완료',
    deliveryDate: '2023.01.29',
    deliveryETA: '2023.01.30',
    productImgUrl: 'https://via.placeholder.com/150',
    productName: '먹이그릇',
    productPrice: 5000,
    productQuantity: 1,
    paymentMethod : "농협은행",
    receiverName: "유재경",
    receiverPhone: "010-1234-5678",
    receiverAddress : "(39866) 경상북도 칠곡군 지천면 금송로 60 글로벌캠퍼스 A동",
    deliveryRequest : "그 외 장소",
  },
];

function MypageOrder() {
  const [selectedSubCategory, setSelectedSubCategory] = useState('마이 페이지'); // 선택된 세부 카테고리
  const getDayOfWeek = (dateString) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const date = new Date(dateString);
    const dayOfWeek = days[date.getDay()];
    return dayOfWeek;
  };

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
        <div className="bg-gray-200 rounded px-5 py-4">
          <div className="font-bold text-2xl mb-3">주문내역</div>
          <div className="bg-white rounded px-5 py-4">            
            {/* Orders */}
            {orders.map((order, index) => (
              <div key={order.id}>
                 <div className={`bg-white ${index === 0 ? 'mt-0' : 'mt-4'} rounded`}>
                  <div className="flex justify-between ">
                    <div className="font-bold text-2xl">{order.deliveryDate} 주문</div>
                    <Link to="/mypage/order/detail">
                      <div className="flex items-center text-lg text-blue-500">
                        주문 상세보기<IoIosArrowForward className="text-2xl ml-1" />
                      </div>
                    </Link>
                  </div>
                  <MypageOrderItem order={order} getDayOfWeek={getDayOfWeek} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MypageOrder;
