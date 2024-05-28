import { useEffect, useState } from "react";
import { apiWithoutAuth } from "../components/common/axios";
import { API } from "../config";
import { ProductItem } from "../types/Market";

export function MarketCartPaySuccess() {
  const [userAddress, setUserAddress] = useState('');
  const [cartOrderInfo, setCartOrderInfo] = useState({
    name: '',
    email: '',
    emailDomain: '',
    phoneNumber: '',
    deliveryNote: ''
  });
  const [selectedProducts, setSelectedProducts] = useState<ProductItem[]>([]);
  const [product] = useState<ProductItem | null>(null);


  const userId = (() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    const [, payloadBase64] = token.split(".");
    const payload = JSON.parse(atob(payloadBase64));
    return payload.sub;
  })();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await apiWithoutAuth.get(`${API}users/${userId}`);
        if (response.data && response.data.address) {
          setUserAddress(response.data.address);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  useEffect(() => {
    // 로컬 스토리지에서 주문자 정보를 가져옴
    const storedOrderInfo = localStorage.getItem('cartOrderInfo');
    if (storedOrderInfo) {
      setCartOrderInfo(JSON.parse(storedOrderInfo));
    }
    const storedSelectedProducts = localStorage.getItem('selectedProducts');
    if (storedSelectedProducts) {
      setSelectedProducts(JSON.parse(storedSelectedProducts));
    }

    // 주문자 정보와 선택된 상품 정보를 삭제
    return () => {
      localStorage.removeItem('cartOrderInfo');
      localStorage.removeItem('selectedProducts');
    };
  }, []);

  const handlePayClick = () => {
    window.location.href = "/market";
  };

  const orderDetailClick = () => {
    window.location.href = "/mypage/order/detail";
  }

  const totalAmount = selectedProducts.reduce((total, product) => total + product.price * product.quantity, 0);

  return (
    <div>
      <div className="pt-10 pb-10 mx-auto max-w-screen-md">

        {/* 주문완료 */}
        <div className="text-white font-bold text-4xl pb-5">주문완료</div>
        <div className="bg-green-700 rounded-xl border-2 border-lime-300 py-10">
          <div className="text-white font-bold text-center text-3xl">주문이 완료되었습니다. 감사합니다!</div>
        </div>

        {/* 주문정보 */}
        <div className="text-white font-bold text-4xl mt-10 pb-5">주문정보</div>
        <div className="bg-green-700 rounded-xl border-2 border-lime-300 px-5 py-4">
          <div className="flex justify-between mb-4">
            <div className="text-white font-bold text-xl">주문상품</div>
            <div className="text-white font-bold text-xl">{selectedProducts.length}건</div>
          </div>
          {selectedProducts.map((product) => (
            <div key={product.id} className="bg-lime-950 rounded-xl px-5 py-4 border-2 border-lime-300 mb-4">
              <div className="flex items-center">
                <div>
                  {product.imageUrl && <img src={product.imageUrl} alt={"상품이미지"} className="rounded-md h-20 w-20 mr-4" />}
                </div>
                <div className="text-white text-xl font-bold">
                  <div>{product.name}</div>
                  <div>{product.price.toLocaleString()}원</div>
                  <div>{product.quantity}개</div>
                </div>
              </div>
            </div>
          ))}

            <div className="border-lime-300 border-b mt-5 mb-5"></div>
            <div className="text-white text-xl text-center mb-1">총 결제금액</div>
            <div className="text-white font-bold text-2xl text-center">
            {(totalAmount + 3000).toLocaleString()}원</div>
          </div>

        {/* 주문자 정보 */}
        <div className="text-white font-bold text-4xl mt-10 pb-5">주문자 정보</div>
        <div className="bg-green-700 rounded-xl border-2 border-lime-300 px-5 py-4">
          <div className="flex justify-between mb-4">
            <div className="text-white font-bold text-xl">주문자</div>
            <div className="text-white text-xl">{cartOrderInfo.name}</div>
          </div>
          <div className="flex justify-between mb-4">
            <div className="text-white font-bold text-xl">이메일</div>
            <div className="text-white text-xl">
              {cartOrderInfo.email}
              @
              {cartOrderInfo.emailDomain}
            </div>
          </div>
          <div className="flex justify-between mb-4">
            <div className="text-white font-bold text-xl">연락처</div>
            <div className="text-white text-xl">{cartOrderInfo.phoneNumber}</div>
          </div>
          <div className="flex justify-between mb-4">
            <div className="text-white font-bold text-xl">배송지</div>
            <div className="text-white text-xl">{userAddress}</div>
          </div>
          <div className="flex justify-between">
            <div className="text-white font-bold text-xl">배송요청사항</div>
            <div className="text-white text-xl">{cartOrderInfo.deliveryNote}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-10 pb-10">
        <button className="bg-gray-600 hover:bg-gray-800 border text-white font-bold text-xl w-56 py-2 rounded-lg mr-6" onClick={orderDetailClick}>주문내역 확인</button>
        <button className="bg-pink-700 hover:bg-pink-900 border text-white font-bold text-xl w-56 py-2 rounded-lg" onClick={handlePayClick}>마켓으로</button>
      </div>
    </div>
  )
}

export default MarketCartPaySuccess;
