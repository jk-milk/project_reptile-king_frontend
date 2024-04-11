import { useState, useEffect } from 'react';
import ProductDescription from '../components/Market/ProductDescription';
import ProductReviews from '../components/Market/ProductReviews';
import StarRating from "../components/Market/StarRating";
import { IoMdRemove, IoMdAdd } from 'react-icons/io';
import { RiShoppingBasketLine } from 'react-icons/ri';
import { FiShoppingCart } from 'react-icons/fi';
import { products } from './Product';
import { categories } from '../components/Market/MarketCategoryList';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState("details");
  const pricePerProduct = 24000;
  const rating = 4;

  useEffect(() => {
    axios.get('http://localhost:8000/api/goods/1')
      .then(response => {
        setProduct(response.data);
      })
      .catch(error => {
        console.error('Error fetching product data:', error);
      });
  }, []);

  // 상품 개수 변경
  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleCartClick = () => {
    const addToCart = window.confirm("해당 상품을 장바구니에 추가하시겠습니까?");
    if (addToCart) {
      window.location.href = "/market/cart";
    }
  };

  const handlePayClick = () => {
    window.location.href = "/market/Pay";
  };

  return (
    <>
      <div className="pt-12 pb-12 mx-auto max-w-screen-lg">
        <p className="text-xl text-white font-bold mb-4">카테고리</p>
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((category) => (
            <Link
              key={category.title}
              to={category.path}
              className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-500 transition-colors duration-300 flex items-center justify-center"
            >
              <span className="mr-2">
                <img src={category.image} className="h-6 w-6" />
              </span>
              <span>{category.title}</span>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="mx-auto max-w-screen-md pb-10">
        <div className="grid grid-cols-12 gap-4">
          {/* 상품 이미지 */}
          <div className="col-span-12 lg:col-span-5">
            <div className="h-80 w-full flex justify-center items-center">
              <img src={products[0].imageUrl} alt="상품 이미지" className="object-cover h-full w-full" />
            </div>
          </div>
          {/* 상품 정보 */}
          <div className="col-span-12 lg:col-span-7">
            <div className="mb-2">
              <div className="flex justify-between mb-3">
                <div>
                  <div className="text-3xl font-bold text-white mb-1">{products[0].name}</div>
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
                <button className="bg-pink-700 rounded-xl hover:bg-pink-400 text-white font-bold px-8 py-2.5 flex items-center justify-center border-2 border-white transition duration-300 ease-in-out" onClick={handlePayClick}>
                  <FiShoppingCart size={24} className="w-8 h-8" />
                  <span className="ml-2 text-lg">구매하기</span>
                </button>

                <button className="bg-gray-600 rounded-xl hover:bg-gray-400 text-white font-bold px-8 py-2.5 flex items-center justify-center border-2 border-white transition duration-300 ease-in-out" onClick={handleCartClick}>
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
    </>
  );
}

export default ProductDetails;
