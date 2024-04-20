import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { ProductItem } from '../types/Market';
import { API } from '../config';
import axios from 'axios';

function MarketPay() {
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [price, setPrice] = useState<number>(0); // 가격 상태 추가
  const [quantity, setQuantity] = useState<number>(1); // 수량 상태 추가
  const { productId } = useParams<{ productId: string }>();
  const location = useLocation();

  useEffect(() => {
    console.log("productId:", productId);
    const searchParams = new URLSearchParams(location.search);
    const priceParam = searchParams.get('price');
    const quantityParam = searchParams.get('quantity');
    const parsedPrice = priceParam ? parseFloat(priceParam) : 0; // 가격 파싱
    const parsedQuantity = quantityParam ? parseInt(quantityParam, 10) : 1; // 수량 파싱
    setPrice(parsedPrice); // 가격 설정
    setQuantity(parsedQuantity); // 수량 설정

    if (productId) {
      const fetchProductDetails = async () => {
        try {
          const response = await axios.get(`${API}goods/${productId}`);
          console.log("Product API response:", response.data);
          if (response.data && typeof response.data === 'object') {
            const { img_urls, ...productData } = response.data;
            const { thumbnail } = JSON.parse(img_urls);
            const productWithThumbnail = {
              ...productData,
              imageUrl: thumbnail,
            };
            setProduct(productWithThumbnail);
          }
        } catch (error) {
          console.error("상품 정보를 불러오는 중 에러 발생:", error);
        }
      };

      fetchProductDetails();
    }
  }, [productId, location.search]);

  const sendPurchaseRequest = async () => {
    try {

      const response = await axios.post(`${API}/purchase`, {
        good_id: productId,
        total_price: price + 3000,
        quantity: quantity,
        payment_selection: '카드결제',
      });
      console.log("Purchase API response:", response.data);
      if (response.status === 201) {
        alert("구매가 성공적으로 완료되었습니다.");
      }
    } catch (error) {
      console.error("구매 요청 중 에러 발생:", error);
    }
  };

  const handleOrder = () => {
    const orderSubmit = window.confirm("결제가 성공적으로 완료되었습니다.");
    if (orderSubmit) {
      sendPurchaseRequest();
      window.location.href = `/market/pay/${productId}/success`;
    }
  };
  
  return (
    <div className="pt-10 pb-10 mx-auto max-w-screen-md">
      <div className="text-white font-bold text-4xl pb-5">주문/결제</div>

      {/* 주문자 */}
      <div className="bg-green-700 rounded-xl border-2 border-lime-300">
        <div className="px-5 py-4">
          <div className="text-white font-bold text-2xl mb-4">주문자</div>
          <table className="text-white text-xl">
            <tbody>
              <tr>
                <td className="pb-4 pr-4">이름</td>
                <td>
                  <input type="text" className="bg-green-700 border border-lime-300 rounded text-white w-60 px-1 py-1 focus:outline-none mb-4" />
                </td>
              </tr>
              <tr>
                <td className="pb-4 pr-4">이메일</td>
                <td>
                  <input type="email" className="bg-green-700 border border-lime-300 rounded text-white w-60 px-1 py-1 focus:outline-none mb-4 mr-1" />
                  @
                  <select className="bg-green-700 border border-lime-300 rounded text-white w-60 px-1 py-1 focus:outline-none mb-4 ml-1">
                    <option>gmail.com</option>
                    <option>naver.com</option>
                    <option>daum.com</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td className="pb-4 pr-4">전화번호</td>
                <td>
                  <input type="tel" className="bg-green-700 border border-lime-300 rounded text-white w-60 px-1 py-1 focus:outline-none mb-4 mr-1" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 배송지 */}
      <div className="bg-green-700 rounded-xl border-2 border-lime-300 mt-5">
        <div className="px-5 py-4">
          <div className="flex justify-between mb-4">
            <div className="text-white font-bold text-2xl">배송지</div>
            <button className="bg-yellow-400 rounded-2xl hover:bg-yellow-200 transition-colors duration-200 focus:outline-none px-3 py-1">
              <span className="text-gray-700 font-bold">변경</span>
            </button>
          </div>
          <div className="flex mb-2">
            <div className="text-white font-bold text-2xl mr-3">배송지 별명</div>
            <div className="bg-pink-700 rounded-2xl px-3 py-1">
              <span className="text-white font-bold">기본 배송지</span>
            </div>
          </div>
          <div className="text-white text-xl">경북 칠곡군 지천면 금송로 60, 글로벌생활관 A동</div>
          <div className="text-white text-xl">배석민 010-3891-5626</div>
        </div>
      </div>

      {/* 주문상품 */}
      <div className="bg-green-700 rounded-xl border-2 border-lime-300 mt-5">
        <div className="px-5 py-4">
          <div className="flex justify-between">
          <div className="text-white font-bold text-2xl mb-4">주문상품</div>
            <div className="text-white text-xl">{quantity}건</div>
          </div>
          {product && (
            <div className="bg-lime-950 rounded-xl px-5 py-4 border-2 border-lime-300">
              <div className="flex items-center">
                <div>
                  <img src={product.imageUrl} alt={product.name} className="rounded-md h-20 w-20 mr-4" />
                </div>
                <div className="text-white text-xl font-bold">
                  <div>{product.name}</div>
                  <div>{product.price.toLocaleString()}원</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 상품금액 */}
      <div className="bg-green-700 rounded-xl border-2 border-lime-300 mt-5">
        <div className="px-5 py-4">
          <div className="text-white font-bold text-2xl mb-4">결제금액</div>
          {product && ( // Conditionally render only when product is not null
            <div>
              <div className="flex justify-between mb-3">
                <div className="text-white text-xl">총 상품금액</div>
                <div className="text-white font-bold text-xl">{product.price.toLocaleString()}원</div>
              </div>
              <div className="flex justify-between mb-5">
                <div className="text-white text-xl">배송비</div>
                <div className="text-white font-bold text-xl">3,000원</div>
              </div>
              <div className="border-lime-300 border-b"></div>
              <div className="flex justify-between pt-5">
                <div className="text-white font-bold text-2xl">최종 결제금액</div>
                <div className="text-white font-bold text-2xl">{(product.price + 3000).toLocaleString()}원</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 결제수단 */}
      <div className="bg-green-700 rounded-xl border-2 border-lime-300 mt-5">
        <div className="px-5 py-4">
          <div className="text-white font-bold text-2xl mb-3">결제</div>
          <img src="/src/assets/market_pay.png" alt="결제" />
        </div>
      </div>

      {/* 결제버튼 */}
      <div className="flex justify-center mt-10">
        <button
          onClick={handleOrder}
          className="bg-pink-700 text-white text-2xl font-bold py-3 px-9 rounded-lg hover:bg-pink-600 focus:outline-none focus:bg-pink-600"
        >
          {(product && product.price) ? `${(product.price + 3000).toLocaleString()}원 결제하기` : '결제하기'}
        </button>
      </div>
    </div>
  );
}
export default MarketPay;
