import React from "react";
import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<FaStar key={i} className="text-pink-500" />);
      } else {
        stars.push(<FaStar key={i} className="text-gray-500" />);
      }
    }
    return stars;
  };

  return <div className="flex items-center">{renderStars()}</div>;
};

export default StarRating;
