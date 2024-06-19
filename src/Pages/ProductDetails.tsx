import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductReviews from '../components/Market/ProductReviews';
import StarRating from "../components/Market/StarRating";
import { IoMdRemove, IoMdAdd } from 'react-icons/io';
import { PiBasketFill } from "react-icons/pi";
import { BiSolidCart } from "react-icons/bi";
import axios from 'axios';
import { GoodsCategory } from '../types/Market';
import { ProductItem } from "../types/Market";
import { apiWithoutAuth } from '../components/common/axios';
import { API } from '../config';
import * as idb from 'idb';

function ProductDetails() {
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState("details");
  const [categories, setCategories] = useState<GoodsCategory[]>([]);
  const [product, setProduct] = useState<ProductItem | null>(null);
  const { productId } = useParams();

  useEffect(() => {
    if (productId) {
      const fetchProductDetails = async () => {
        try {
          const response = await apiWithoutAuth.get(`${API}goods/${productId}`);
          if (response.data) {
            const responseData = response.data;
            const { img_urls, ...productData } = responseData;
            const { thumbnail, info } = img_urls;
            const productWithThumbnail = {
              ...productData,
              imageUrl: thumbnail,
              infoUrl: info,
              delivery_fee: responseData.delivery_fee, 
            };
            setProduct(productWithThumbnail);
          }
        } catch (error) {
          console.error("상품 상세 정보를 불러오는 중 에러 발생:", error);
        }
      };

      fetchProductDetails();
    }
  }, [productId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://54.180.158.4:8000/api/categories");
        const goods = response.data.filter((data: GoodsCategory) => data.division === 'goods');
        setCategories(goods);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [productId]);

  // 상품 개수 변경 함수
  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const updateProductPrice = (product: ProductItem, quantity: number) => {
    const updatedPrice = product.price * quantity;
    return {
      ...product,
      quantity: quantity,
      price: updatedPrice
    };
  };

  const addToCartIndexedDB = async (product: ProductItem) => {
    try {
      // 사용자별 데이터베이스를 엽니다.
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("accessToken이 없습니다.");
        return;
      }
  
      const [, payloadBase64] = token.split(".");
      const payload = JSON.parse(atob(payloadBase64));
      const userId = payload.sub; // 'sub' 필드가 사용자 ID를 나타냄
  
      const db = await idb.openDB(`cart_${userId}`, 2, {
        upgrade(db) {
          db.createObjectStore('cart', { autoIncrement: true, keyPath: 'id' });
        },
      });
  
      // 변경된 수량에 따라 가격을 업데이트합니다.
      const updatedProduct = updateProductPrice(product, quantity);
  
      // 조절된 가격과 원래 가격을 추가합니다.
      const productWithPrices = {
        ...updatedProduct,
        originalPrice: product.price,
      };
  
      await db.add('cart', productWithPrices);
      console.log('상품이 장바구니에 추가되었습니다.');
    } catch (error) {
      console.error('장바구니에 상품을 추가하는 중 에러가 발생했습니다:', error);
    }
  };
  
  const handleCartClick = async () => {
    const addToCart = window.confirm("해당 상품을 장바구니에 추가하시겠습니까?");
    if (addToCart && product) {
      try {
        // 이미 상품 정보가 로드되었으므로 다시 서버에 요청하지 않고 product 변수를 사용합니다.
        const cartProduct = {
          productId: productId,
          quantity: quantity,
          price: product.price,
          name: product.name,
          imageUrl: product.imageUrl,
          deliveryFee : product.delivery_fee
        };

        await addToCartIndexedDB(cartProduct);
        window.location.href = "/market/cart";
      } catch (error) {
        console.error("장바구니에 상품을 추가하는 중 에러가 발생했습니다:", error);
      }
    }
  };

  // 상품 구매
  const handlePayClick = () => {
    const adjustedPrice = quantity * (product?.price || 0);
    const confirmation = window.confirm("해당 상품을 구매하시겠습니까?");

    if (confirmation) {
      window.location.href = `/market/pay/${productId}?price=${adjustedPrice}&quantity=${quantity}`;
    }
  };

  return (
    <>
      {/* 카테고리 표시 */}
      <div className="pt-12 pb-10 mx-auto max-w-screen-lg">
        <p className="text-xl text-white font-bold mb-4">카테고리</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/market/${category.id}`}
              className="bg-white px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-300 flex items-center justify-center"
            >
              <span className="mr-2">
                <img src={category.img_url} className="h-6 w-6 border border-gray-300 rounded-xl" />
              </span>
              <span>{category.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-screen-lg pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* 상품 이미지 */}
          <div className="bg-white rounded-md overflow-hidden shadow-lg">
            {product && (
              <div className="h-full w-full flex justify-center items-center overflow-hidden">
                <img src={product.imageUrl} alt="상품 이미지" className="object-cover h-full w-full" />
              </div>
            )}
          </div>
          {/* 상품 정보 */}
          <div className="bg-white rounded-md p-6 shadow-lg flex flex-col justify-between">
            {product && (
              <div>
                <div className="text-3xl font-bold mb-1">{product.name}</div>
                <div className="mb-1 flex items-center">
                  <StarRating rating={product.rating} />
                  <span className="ml-1">({product.reviewCount})</span>
                </div>
                {product.price && (
                  <div className="text-lg font-bold mb-1">{product.price.toLocaleString()}원</div>
                )}
                <div className="flex justify-between">
                  <div className="text-lg font-bold">배송비</div>
                  <div className="text-lg">{product.delivery_fee.toLocaleString()}원</div>
                </div>

                <hr className="border-gray-400 my-3" />
                <div className="text-md mb-2">{product.name}</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-center">
                    <button onClick={() => handleQuantityChange(quantity - 1)} className="bg-gray-200 p-2 border-l border-t border-b border-gray-300 hover:bg-gray-300 focus:outline-none">
                      <IoMdRemove size={16} />
                    </button>
                    <div className="w-10 text-center bg-white border border-gray-300 px-2 py-1">{quantity}</div>
                    <button onClick={() => handleQuantityChange(quantity + 1)} className="bg-gray-200 p-2 border-r border-t border-b border-gray-300 hover:bg-gray-300 focus:outline-none">
                      <IoMdAdd size={16} />
                    </button>
                  </div>
                  <div className="text-xl font-bold">{(quantity * product.price).toLocaleString()}원</div>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <div className="font-bold">주문수량</div>
                  <div>{quantity}개</div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="font-bold">총 상품 금액 <span className="text-sm text-gray-500 font-thin">(상품금액 + 배송비)</span></div>
                  <div>{(quantity * product.price + product.delivery_fee).toLocaleString()}원</div>
                </div>
              </div>
            )}
            {/* 버튼 그룹 */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <button className="bg-pink-600 hover:bg-pink-400 text-white font-bold py-3 rounded-lg flex items-center justify-center transition duration-300 ease-in-out" onClick={handlePayClick}>
                <BiSolidCart size={24} className="mr-2" />
                구매하기
              </button>
              <button className="bg-gray-600 hover:bg-gray-400 text-white font-bold py-3 rounded-lg flex items-center justify-center transition duration-300 ease-in-out" onClick={handleCartClick}>
                <PiBasketFill size={24} className="mr-2" />
                장바구니
              </button>
            </div>
          </div>
        </div>


        {/* 상세정보 및 상품평 탭 */}
        <div className="bg-white mt-10 flex flex-col">
          <div className="border-b border-gray-300">
            <ul className="flex justify-center">
              {/* 상세정보 탭 */}
              <li
                className={`px-4 py-4 text-black text-lg text-center cursor-pointer hover:bg-gray-300 font-bold ${selectedTab === 'details' && 'bg-gray-300'} w-1/2`}
                onClick={() => setSelectedTab('details')}
              >
                상세정보
              </li>
              {/* 상품평 탭 */}
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
              {/* 선택된 탭에 따라 해당 컴포넌트 표시 */}
              <div className="flex justify-center">
                {selectedTab === "details" && <div>
                  <img src={product?.infoUrl} alt="상세 정보" />
                </div>}
              </div>
              {selectedTab === "reviews" && <ProductReviews />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetails;
