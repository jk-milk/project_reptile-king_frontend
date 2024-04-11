import React from "react";
import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  onClick: (rating: number) => void; // 클릭된 별의 순서를 처리하기 위한 콜백 함수
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onClick }) => {
  const handleClick = (selectedRating: number) => {
    onClick(selectedRating);
  };

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => {
        const currentRating = index + 1;
        return (
          <FaStar
            key={index}
            className={currentRating <= rating ? "text-pink-500 cursor-pointer" : "text-gray-300 cursor-pointer"}
            onClick={() => handleClick(currentRating)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
