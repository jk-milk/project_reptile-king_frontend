import { useState } from 'react';
import MypageCategory from '../components/Mypage/MypageCategory';
import MypageOrderItem from '../components/Mypage/MypageOrderItem';
import { orders } from './MypageOrder';

function MypageOrderDetail() {
  const [selectedSubCategory, setSelectedSubCategory] = useState('마이 페이지'); // 선택된 세부 카테고리

  const getDayOfWeek = (dateString: string | number | Date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const date = new Date(dateString);
    const dayOfWeek = days[date.getDay()];
    return dayOfWeek;
  };

  const firstOrder = orders[0];

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
          <div className="font-bold text-2xl mb-3">주문상세</div>

          <div className="bg-white rounded px-5 py-4">
            {/* 첫 번째 주문만 표시 */}
            <div>
              {/* 주문 상세 정보 */}
              <div className="font-bold text-2xl mb-2">2024.04.25 주문</div>
              <MypageOrderItem order={firstOrder} getDayOfWeek={getDayOfWeek} />

              {/* 받는사람 정보 */}
              <div className="mt-16">
                <div className="text-xl mb-3 font-bold">받는사람 정보</div>
                <hr className="border-black mb-3" />
                <div className="space-y-3 text-lg">
                  <div className="flex items-center">
                    <div className="text-gray-500 w-40">받는사람</div>
                    <div>{firstOrder.receiverName}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-gray-500 w-40">연락처</div>
                    <div>{firstOrder.receiverPhone}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-gray-500 w-40">받는주소</div>
                    <div>{firstOrder.receiverAddress}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-gray-500 w-40">배송요청사항</div>
                    <div>{firstOrder.deliveryRequest}</div>
                  </div>
                </div>
              </div>

              {/* 결제 정보 */}
              <div className="mt-12 mb-3">
                <div className="text-xl mb-3 font-bold">결제 정보</div>
                <hr className="border-black mb-3" />
                <div className="space-y-3 text-lg">
                  <div className="flex items-center">
                    <div className="text-gray-500 w-40">결제수단</div>
                    <div>농협은행</div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-gray-500 w-40">상품가격</div>
                    <div>68,000원</div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-gray-500 w-40">배송비</div>
                    <div>3,000원</div>
                  </div>
                </div>
              </div>

              <div className="text-right mt-12 mb-3">
                <div className="font-bold text-xl inline-block mr-4">총 결제금액</div>
                <div className="font-bold text-3xl inline-block">71,000원</div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MypageOrderDetail;
