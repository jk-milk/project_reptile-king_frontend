import { useState, useEffect } from 'react';
import StarRating from './StarRating'; 
import { API } from '../../config';
import { Review } from '../../types/Market';

const ProductReviews = ({ productId }: { productId: number }) => {
  const [reviews, setReviews] = useState<Review[]>([]); // 초기값을 빈 배열로 설정

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API}good_reviews/good_id=${productId}`);
        if (!response.ok) {
          throw new Error('상품 리뷰를 불러오는 데 실패했습니다.');
        }
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('상품 리뷰를 불러오는 중 에러 발생:', error);
      }
    };

    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  return (
    <div>
      {reviews.map((review) => (
        <div key={review.id} className="bg-gray-100 p-4 border border-gray-300 rounded-sm mb-4">
          <div className="flex items-center mb-3">
            <img className="h-12 w-12 rounded-full" src={review.user_profile_url} alt="User Profile" />
            <div className="ml-2">
              <p className="text-black">{review.user_name}</p>
              <p className="text-gray-600 flex items-center">
                <span className="mr-2"><StarRating rating={review.stars} /></span>
                {review.created_at}
              </p>
            </div>
          </div>
          <img src={review.img_url} alt="리뷰 이미지" />
          <p className="text-gray-700 mt-2">{review.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductReviews;
