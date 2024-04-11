import React, { useState } from 'react';
import { orders } from '../../Pages/MypageOrder';
import { Link } from 'react-router-dom';

export const inquiry = [
  {
    id: 1,
    inquiryDate: "2023.02.05",
    inquiryTitle: "취소신청",
    inquiryContent: "단순변심으로 인한 취소",
    inquiryStatus: "답변완료",
    inquiryImage : "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMTAzMTBfMTc5%2FMDAxNjE1Mzc3NDk5MzA0.Lu9lqAAV8vtMXs1zTa2VnbhUNQh2S2YSq2hJSJGxVogg.MqldOIKHkE4sA31aBhzCPIBkaegNJ_UBSpaOgvgMKK4g.JPEG.rock5484%2FKakaoTalk_20210310_203932747_05.jpg&type=sc960_832"
  },
  {
    id: 2,
    inquiryDate: "2023.02.08",
    inquiryTitle: "교환신청",
    inquiryContent: "상품 불량",
    inquiryStatus: "답변확인중"
  },
];

const HelpCompleteItem: React.FC = () => {
  const [reviewItems, setReviewItems] = useState(orders);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("문의를 삭제하시겠습니까?");
    if (confirmDelete) {
      setReviewItems(reviewItems.filter(item => item.id !== id));
    }
  };

  return (
    <div>
      {reviewItems.length === 0 ? (
        <div className="text-center text-gray-600 text-lg mt-3">작성한 문의가 없습니다.</div>
      ) : (
        reviewItems.map((order) => {
          const matchingInquiry = inquiry.find(inquiry => inquiry.id === order.id);

          return (
            <div className="border-2 rounded items-center mt-2 px-4 py-3" key={order.id}>
              <div className="flex items-center justify-between border-b-2 border-gray-200">
                <div className="flex items-center mb-2">
                  <img
                    src={order.productImgUrl}
                    alt={order.productName}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="ml-4 text-lg">
                    <div>{order.productName}</div>
                    <div className="flex items-center">
                      <div className="text-gray-500 text-base">{matchingInquiry.inquiryDate}</div>
                    </div>
                  </div>

                </div>
                <div>
                  <Link to="/mypage/help/detail">
                    <button className="hover:bg-gray-300 bg-gray-500 text-white font-bold py-1 px-4 rounded mr-2 self-center">
                      상세보기
                    </button>
                  </Link>
                  <Link to="/mypage/help/edit">
                    <button className="hover:bg-blue-200 bg-blue-500 text-white font-bold py-1 px-4 rounded mr-2 self-center">
                      수정
                    </button>
                  </Link>
                  <button className="hover:bg-red-200 bg-red-500 text-white font-bold py-1 px-4 rounded self-center" onClick={() => handleDelete(order.id)}>
                    삭제
                  </button>
                </div>
              </div>
              <div className="font-bold text-xl mt-2">
                {matchingInquiry.inquiryTitle}
              </div>
              <div className="mt-1">
                {matchingInquiry.inquiryContent}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default HelpCompleteItem;
