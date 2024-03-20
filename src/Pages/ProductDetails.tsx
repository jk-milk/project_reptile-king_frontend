import { useState } from 'react';
import ProductDescription from '../components/Market/ProductDescription';
import ProductReviews from '../components/Market/ProductReviews';
import StarRating from "../components/Market/StarRating";
import { IoMdRemove, IoMdAdd } from 'react-icons/io';
import { RiShoppingBasketLine } from 'react-icons/ri';
import { FiShoppingCart } from 'react-icons/fi';
import { products } from './Product';

function ProductDetails() {
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState("details"); // 탭 선택 상태
  const pricePerProduct = 24000;
  const rating = 4;

  // 상품 개수 변경
  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  return (
    <div className="pt-10 pb-10 mx-auto max-w-screen-lg">
      <div className="grid grid-cols-12 gap-4">
        {/* 상품 이미지 */}
        <div className="col-span-12 md:col-span-6 lg:col-span-5">
          <div className="h-80 w-full flex justify-center items-center">
            <img src={products[0].imageUrl} alt="상품 이미지" className="object-cover h-full w-full" />
          </div>
        </div>
        {/* 상품 정보 */}
        <div className="col-span-12 md:col-span-6 lg:col-span-7">
          <div className="mb-2">
            <div className="flex justify-between mb-3">
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">{products[0].name}</h2>
                <div className="mb-1 flex">
                  <StarRating rating={rating} />
                  <span className="text-white ml-2">({products[0].reviewCount})</span>
                </div>
                <div className="text-lg font-bold text-white mb-1">{pricePerProduct.toLocaleString()}원</div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-lg font-bold text-white">배송비</span>
                  <span className="ml-auto text-white">무료배송</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white">혜택</span>
                  <span className="ml-auto text-white">14P 적립</span>
                </div>

              </div>
            </div>

            <hr className="border-gray-400" />

            {/* 상품 개수 조절 바 */}
            <div className="mt-2">
              <table className="w-full">
                <tbody>
                  {/* 윗줄: 상품명, 수량, 총 상품 금액 */}
                  <tr>
                    <td className="text-lg font-bold text-white text-center">상품명</td>
                    <td className="text-lg font-bold text-white text-center">수량</td>
                    <td className="text-lg font-bold text-white text-center">총 상품 금액</td>
                  </tr>
                  {/* 아랫줄: 실제 상품명, 수량, 총 상품 금액 */}
                  <tr>
                    <td className="text-white text-lg text-center">{products[0].name}</td>
                    <td className="flex justify-center">
                      <button onClick={() => handleQuantityChange(quantity - 1)} className="bg-gray-200 p-2 border-l border-t border-b border-gray-300 hover:bg-gray-300 focus:outline-none">
                        <IoMdRemove size={16} />
                      </button>
                      <div className="w-10 text-center bg-white border border-gray-300 px-2 py-1">{quantity}</div>
                      <button onClick={() => handleQuantityChange(quantity + 1)} className="bg-gray-200 p-2 border-r border-t border-b border-gray-300 hover:bg-gray-300 focus:outline-none">
                        <IoMdAdd size={16} />
                      </button>
                    </td>
                    <td className="text-white text-lg text-center">{(quantity * pricePerProduct).toLocaleString()}원</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-2 gap-4 justify-center mt-5">
              <button className="bg-pink-700 rounded-xl hover:bg-pink-400 text-white font-bold px-8 py-2.5 flex items-center justify-center border-2 border-white transition duration-300 ease-in-out">
                <FiShoppingCart size={24} className="w-8 h-8" />
                <span className="ml-2 text-lg">구매하기</span>
              </button>
              <button className="bg-gray-600 rounded-xl hover:bg-gray-400 text-white font-bold px-8 py-2.5 flex items-center justify-center border-2 border-white transition duration-300 ease-in-out">
                <RiShoppingBasketLine size={24} className="w-8 h-8" />
                <span className="ml-2 text-lg">장바구니</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 상세정보 및 상품평 */}
      <div className="bg-white mt-10 flex flex-col">
        <div className="border-b border-gray-300">
          <ul className="flex justify-center">
            <li
              className={`px-4 py-4 text-black text-lg text-center cursor-pointer hover:bg-gray-300 font-bold ${selectedTab === 'details' && 'bg-gray-300'} w-1/2`}
              onClick={() => setSelectedTab('details')}
            >
              상세정보
            </li>
            <li
              className={`px-4 py-4 text-black text-lg text-center  cursor-pointer hover:bg-gray-300 font-bold ${selectedTab === 'reviews' && 'bg-gray-300'} w-1/2`}
              onClick={() => setSelectedTab('reviews')}
            >
              리뷰
            </li>
          </ul>
        </div>
        <div className="p-4 flex justify-center">
          <div className="w-full max-w-screen-lg">
            <div className="flex justify-center">
              {selectedTab === "details" && <ProductDescription />}
            </div>
            {selectedTab === "reviews" && <ProductReviews />}
            {selectedTab === "reviews" && <ProductReviews />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;