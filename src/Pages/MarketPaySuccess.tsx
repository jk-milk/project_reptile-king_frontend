import { useEffect, useState } from "react";
import { apiWithoutAuth } from "../components/common/axios";
import { API } from "../config";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { ProductItem } from "../types/Market";

export function MarketPaySuccess() {
  const [userAddress, setUserAddress] = useState('');
  const [orderInfo, setOrderInfo] = useState({
    name: '',
    email: '',
    emailDomain: '',
    phoneNumber: '',
    deliveryNote: ''
  });
  const [productInfo, setProductInfo] = useState({
    name: '',
    price: '',
    quantity: '',
    totalPrice: ''
  });
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<ProductItem | null>(null);
  const location = useLocation();

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
    const storedOrderInfo = localStorage.getItem('orderInfo');
    if (storedOrderInfo) {
      setOrderInfo(JSON.parse(storedOrderInfo));
    }
    // 로컬 스토리지에서 상품 정보를 가져옴
    const storedProductInfo = localStorage.getItem('productInfo');
    if (storedProductInfo) {
      setProductInfo(JSON.parse(storedProductInfo));
    }
  }, []);

  useEffect(() => {

    if (productId) {
      const fetchProductDetails = async () => {
        try {
          const response = await axios.get(`${API}goods/${productId}`);
          if (response.data) {
            const { img_urls, ...productData } = response.data;
            const { thumbnail } = (img_urls);
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

  const handlePayClick = () => {
    window.location.href = "/market";
  };

  const orderDetailClick = () => {
    window.location.href = "/mypage/order/detail";
  }

  return (
    <div>
      <div className="pt-10 pb-10 mx-auto max-w-screen-md">

        {/* 주문완료 */}
        <div className="text-white font-bold text-4xl pb-5">注文完了</div>
        <div className="bg-green-700 rounded-xl border-2 border-lime-300 py-10">
          <div className="text-white font-bold text-center text-3xl">注文が完了しました。ありがとうございます！</div>
        </div>

        {/* 주문정보 */}
        <div className="text-white font-bold text-4xl mt-10 pb-5">注文情報</div>
        <div className="bg-green-700 rounded-xl border-2 border-lime-300 px-5 py-4">
          <div className="flex justify-between mb-4">
            <div className="text-white font-bold text-xl">注文商品</div>
            <div className="text-white font-bold text-xl">{productInfo.quantity}個</div>
          </div>
          <div className="bg-lime-950 rounded-xl px-5 py-4 border-2 border-lime-300">
            <div className="flex items-center">
              <div>
                {product && product.imageUrl && <img src={product.imageUrl} alt={"상품이미지"} className="rounded-md h-20 w-20 mr-4" />}
              </div>
              <div className="text-white text-xl font-bold ml-4">
                <div>{productInfo.name}</div>
                <div>{productInfo.price.toLocaleString()}円</div>
              </div>
            </div>

            <div className="border-lime-300 border-b mt-5 mb-5"></div>
            <div className="text-white text-xl text-center mb-1">お支払い総額</div>
            <div className="text-white font-bold text-2xl text-center">
              {productInfo.totalPrice}円</div>
          </div>
        </div>

        {/* 주문자 정보 */}
        <div className="text-white font-bold text-4xl mt-10 pb-5">注文者情報</div>
        <div className="bg-green-700 rounded-xl border-2 border-lime-300 px-5 py-4">
          <div className="flex justify-between mb-4">
            <div className="text-white font-bold text-xl">注文者</div>
            <div className="text-white text-xl">{orderInfo.name}</div>
          </div>
          <div className="flex justify-between mb-4">
            <div className="text-white font-bold text-xl">メールアドレス</div>
            <div className="text-white text-xl">
              {orderInfo.email}
              @
              {orderInfo.emailDomain}
            </div>
          </div>
          <div className="flex justify-between mb-4">
            <div className="text-white font-bold text-xl">電話番号</div>
            <div className="text-white text-xl">{orderInfo.phoneNumber}</div>
          </div>
          <div className="flex justify-between mb-4">
            <div className="text-white font-bold text-xl">お届け先</div>
            <div className="text-white text-xl">60, Geumsong-ro, Jicheon-meon, YEUNGJIN UNIVERSITY</div>
          </div>
          <div className="flex justify-between">
            <div className="text-white font-bold text-xl">配送要請事項</div>
            <div className="text-white text-xl">{orderInfo.deliveryNote}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-10 pb-10">
        {/* <button className="bg-gray-600 hover:bg-gray-800 border text-white font-bold text-xl w-56 py-2 rounded-lg mr-6" onClick={orderDetailClick}>주문내역 확인</button> */}
        <button className="bg-pink-700 hover:bg-pink-900 border text-white font-bold text-xl w-56 py-2 rounded-lg" onClick={handlePayClick}>マーケットへ</button>
      </div>
    </div>
  )
}

export default MarketPaySuccess;
