import React from "react";

interface MarketCategoryItemProps {
  title: string;
  count: number;
  image: string;
}

const MarketCategoryItem: React.FC<MarketCategoryItemProps> = ({ title, count, image }) => {
  return (
    <div className="bg-white rounded hover:bg-gray-200 overflow-hidden shadow-md md:w-64 h-16 flex items-center">
      <div className="p-2 flex items-center w-full">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img
            src={image}
            alt="category"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="px-2 py-1 flex-grow">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-700 font-bold">{title}</h3>
            <div className="bg-gray-300 font-bold px-1">{count}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketCategoryItem;
