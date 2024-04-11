import React from 'react';
import { Link } from 'react-router-dom';
import { orders } from '../../Pages/MypageOrder';

const MypageReviewCreateItem: React.FC = () => {

  return (
    <div>
      {orders.map((order) => (
        <div className="border-2 rounded items-center mt-2 px-4 py-3" key={order.id}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={order.productImgUrl}
                alt={order.productName}
                className="w-16 h-16 rounded-full"
              />
              <div className="ml-4 text-lg">
                <div>{order.productName}</div>
                <div className="flex items-center">
                  <div className="text-gray-500">{order.deliveryETA} 배송</div>
                </div>
              </div>
            </div>
            <div>
              <Link to="/mypage/order/review/create">
                <button
                  className="hover:bg-blue-200 text-blue-500 border-2 border-blue-500 font-bold py-1 px-4 rounded self-center"
                >
                  리뷰작성
                </button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MypageReviewCreateItem;
