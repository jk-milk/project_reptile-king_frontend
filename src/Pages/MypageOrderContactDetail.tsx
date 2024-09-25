import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MypageCategory from '../components/Mypage/MypageCategory';
import MypageOrderContactItem from '../components/Mypage/MypageOrderContactItem'
import { orders } from './MypageOrder';
import { transaction } from './MypageOrderContact';

function MypageOrderContactDetail() {
  const [selectedSubCategory, setSelectedSubCategory] = useState('마이 페이지'); // 선택된 세부 카테고리
  const selectedTransaction = transaction[0];
  const firstOrder = orders[0];
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 이동하거나 다른 경로로 설정 가능
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
          <div className="font-bold text-2xl mb-3">{selectedTransaction.orderStatus}상세</div>

          <div className="bg-white rounded px-5 py-4">
            {/* 첫 번째 주문만 표시 */}
            <div>
              {/* 주문 상세 정보 */}
              <MypageOrderContactItem order={firstOrder} transaction={selectedTransaction} />
              {/* 상세 정보 */}
              <div className="mt-16">
                <div className="text-xl mb-3 font-bold">상세정보</div>
                <hr className="border-black mb-3" />
                <div className="space-y-3 text-lg">
                  <div className="flex items-center">
                    <div className="text-gray-500 w-40">{selectedTransaction.orderStatus}접수일자</div>
                    <div>{selectedTransaction.statusDate}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-gray-500 w-40">{selectedTransaction.orderStatus}접수번호</div>
                    <div>{selectedTransaction.orderNum}</div>
                  </div>
                </div>
              </div>

              {/* 취소 사유 */}
              <div className="mt-12 mb-3">
                <div className="text-xl mb-3 font-bold">{selectedTransaction.orderStatus}사유</div>
                <hr className="border-black mb-3" />
                <div className="space-y-3 text-lg">
                  <div className="flex items-center">
                    <div className="text-gray-500 w-40">{selectedTransaction.orderStatus}사유</div>
                    <div className="font-bold">{selectedTransaction.reason}</div>
                  </div>
                </div>
              </div>

              {/* 환불 안내 */}
              <div className="mt-12 mb-2">
                <div className="text-xl mb-3 font-bold">환불안내</div>
                <hr className="border-black mb-3" />
                <div className="space-y-3 text-lg">
                  <div className="flex items-center">
                    <div className="text-gray-500 w-40">총 결제금액</div>
                    <div>{firstOrder.productPrice.toLocaleString()}원</div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-gray-500 w-40">반품비</div>
                    <div>0원</div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-gray-500 w-40">환불수단</div>
                    <div>{firstOrder.paymentMethod}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-gray-500 w-40">환불 예상금액</div>
                    <div className="font-bold text-xl text-red-600">{firstOrder.productPrice.toLocaleString()}원</div>
                  </div>

                </div>
                {/* "목록으로" 버튼 */}
                <div className="mt-24 flex justify-center items-center">
                  <button
                    onClick={handleGoBack}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  >
                    목록으로
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MypageOrderContactDetail;
