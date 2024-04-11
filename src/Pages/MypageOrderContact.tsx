import { useState } from 'react';
import { Link } from 'react-router-dom';
import MypageCategory from '../components/Mypage/MypageCategory';
import { orders } from './MypageOrder';
import { API } from '../config';
import axios from 'axios';

export const transaction = [
  {
    id: 1,
    status: "취소접수",
    orderNum: 256168156165156,
    orderStatus: "취소",
    statusDate: "2023.02.01",
    reason: "상품을 추가하여 재주문",
  },
  {
    id: 2,
    status: "환불완료",
    orderNum: 216168234516567,
    orderStatus: "반품",
    statusDate: "2023.02.03",
    reason: "단순변심",
  },
];

function MypageOrderContact() {
  const [selectedSubCategory, setSelectedSubCategory] = useState('마이 페이지'); // 선택된 세부 카테고리

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
          <div className="font-bold text-2xl mb-3">취소/반품/교환/환불내역</div>
          <div className="bg-white rounded px-5 py-4">
            {orders.map((order, index) => (
              <div key={order.id} className={`${index === 0 ? 'mt-0' : 'mt-2'} border-2 px-5 py-4 flex items-center justify-between rounded`}>
                <div>
                  <div className="font-bold text-xl">{transaction[index].status}</div>
                  <div className="text-lg mt-1">주문일: {order.deliveryDate}</div>
                  <div className="text-lg mt-1">접수일: {transaction[index].statusDate}</div>
                  <div className="flex items-center mt-2">
                    <div>
                      <img
                        src={order.productImgUrl}
                        alt={order.productName}
                        className="w-16 h-16 rounded-full"
                      />
                    </div>
                    <div className="ml-4 text-lg">
                      <div>{order.productName}</div>
                      <div className="flex items-center mt-1">
                        <div>{order.productPrice.toLocaleString()}원</div>
                        <div className="ml-3">{order.productQuantity}개</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <Link to="/mypage/order/contact/detail" className="hover:bg-blue-200 text-blue-500 border-2 border-blue-500 font-bold py-1 px-4 rounded mb-2">
                    취소상세
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MypageOrderContact;
