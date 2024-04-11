import React, { useState } from 'react';
import { orders } from '../../Pages/MypageOrder';
import StarRating from '../Market/StarRating';
import { Link } from 'react-router-dom';

export const reviews = [
  {
    id: 1,
    rating: 3,
    reviewDate: "2023.02.02",
    reviewTitle: "영양가 풍부한 도마뱀 사료, 가격은 조금 아쉬움",
    reviewContent: "크레 슈퍼푸드 도마뱀 사료를 구매해봤는데, 도마뱀이 좋아해서 기뻤어요. 영양도 풍부하고 소화도 잘 되어서 건강에 도움이 될 것 같아요. 다만 가격이 좀 비싸서 아쉬웠어요."
  },
  {
    id: 2,
    rating: 5,
    reviewDate: "2023.02.05",
    reviewTitle: "가성비 좋은 튼튼한 먹이그릇이네요. 모양도 이뻐요^^",
    reviewContent: "크기는 성인여성 손바닥만 합니다. 생각보다 좀 커서 놀랐지만 큰 사육장에 넉넉히 들어가요. 크레스티드 게코 슈퍼푸드 자율 급여용으로 좋아요."
  },
];

const ReviewCompleteItem: React.FC = () => {
  const [reviewItems, setReviewItems] = useState(orders);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("리뷰를 삭제하시겠습니까?");
    if (confirmDelete) {
      setReviewItems(reviewItems.filter(item => item.id !== id));
    }
  };

  return (
    <div>
      {reviewItems.length === 0 ? (
        <div className="text-center text-gray-600 text-lg mt-3">작성한 리뷰가 없습니다.</div>
      ) : (
        reviewItems.map((order) => {
          const matchingReview = reviews.find(review => review.id === order.id);

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
                      {matchingReview && <StarRating rating={matchingReview.rating} />}
                      <div className="ml-2 text-gray-500 text-base">{matchingReview && matchingReview.reviewDate}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <Link to="/mypage/order/review/edit">
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
                {matchingReview.reviewTitle}
              </div>
              <div className="mt-1">
                {matchingReview?.reviewContent}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ReviewCompleteItem;
