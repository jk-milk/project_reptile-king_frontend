import { ProductItem } from '../types/Market';
import Select from 'react-select';
import { API } from '../config';
import axios from 'axios';
import { apiWithAuth, apiWithoutAuth } from '../components/common/axios';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

function MarketPay() {
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [price, setPrice] = useState<number>(0); // 가격 상태 추가
  const [quantity, setQuantity] = useState<number>(1); // 수량 상태 추가
  const { productId } = useParams<{ productId: string }>();
  const location = useLocation();
  const [orderInfo, setOrderInfo] = useState({
    name: '',
    email: '',
    emailDomain: '',
    phoneNumber: '',
    deliveryNote: ''
  });
  const [selectedDeliveryNote, setSelectedDeliveryNote] = useState(''); // 선택된 배송 요청 사항 상태 추가
  const userId = (() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    const [, payloadBase64] = token.split(".");
    const payload = JSON.parse(atob(payloadBase64));
    return payload.sub;
  })();
  const [userInfo, setUserInfo] = useState({
    address: '',
    name: '',
    phone: ''
  });
  
  useEffect(() => {
    if (!userId) {
      console.error('User ID not found');
      return;
    }
    console.log('Fetching user info for user ID:', userId);
  
    const fetchUserInfo = async () => {
      try {
        const response = await apiWithAuth.get(`${API}users/${userId}`);
        console.log('User info fetched:', response.data);
        setUserInfo(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
  
    fetchUserInfo();
  }, [userId]);

  const handleDeliveryNoteChange = (selectedOption) => {
    setSelectedDeliveryNote(selectedOption.label);
  };

  useEffect(() => {
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

  const sendPurchaseRequest = async () => {
    try {
      const response = await apiWithAuth.post(`${API}purchases`, {
        good_id: productId,
        total_price: price + 3000,
        quantity: quantity,
        payment_selection: '카드결제',
      });

      console.log("Purchase API response:", response.data);
    } catch (error) {
      console.error("구매 요청 중 에러 발생:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
const handleOrder = async () => {
  try {
    const updatedOrderInfo = { ...orderInfo, deliveryNote: selectedDeliveryNote };
    localStorage.setItem('orderInfo', JSON.stringify(updatedOrderInfo));
    await sendPurchaseRequest();
    const confirmation = window.confirm("해당 상품을 구매하시겠습니까?");
    if (confirmation) {
      if (product) {
        const productInfo = {
          name: product.name,
          price: product.price,
          quantity: quantity,
          totalPrice: (product.price * quantity + 3000).toLocaleString()
        };

        localStorage.setItem('productInfo', JSON.stringify(productInfo));
        window.location.href = `/market/pay/${productId}/success?price=${price}&quantity=${quantity}`;
      } else {
        console.error("상품 정보가 없습니다.");
      }
    }
  } catch (error) {
    console.error('구매 요청 중 에러 발생:', error);
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
                  <input
                    type="text"
                    name="name"
                    value={orderInfo.name}
                    onChange={handleInputChange}
                    className="bg-green-700 border border-lime-300 rounded text-white w-60 px-1 py-1 focus:outline-none mb-4"
                  />
                </td>
              </tr>
              <tr>
                <td className="pb-4 pr-4">이메일</td>
                <td>
                  <input
                    type="email"
                    name="email"
                    value={orderInfo.email}
                    onChange={handleInputChange}
                    className="bg-green-700 border border-lime-300 rounded text-white w-60 px-1 py-1 focus:outline-none mb-4 mr-1"
                  />
                  @
                  <select
                    name="emailDomain"
                    value={orderInfo.emailDomain}
                    onChange={handleInputChange}
                    className="bg-green-700 border border-lime-300 rounded text-white w-60 px-1 py-1 focus:outline-none mb-4 ml-1"
                  >
                    <option>gmail.com</option>
                    <option>naver.com</option>
                    <option>daum.com</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td className="pb-4 pr-4">전화번호</td>
                <td>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={orderInfo.phoneNumber}
                    onChange={handleInputChange}
                    className="bg-green-700 border border-lime-300 rounded text-white w-60 px-1 py-1 focus:outline-none mb-4 mr-1"
                  />
                </td>
              </tr>
              <tr>
                <td className="pb-1 pr-4">배송요청사항</td>
                <td>
                  <Select
                    options={[
                      { value: 'option1', label: '부재 시 경비실에 맡겨주세요.' },
                      { value: 'option2', label: '부재 시 택배함에 넣어주세요.' },
                      { value: 'option3', label: '부재 시 집 앞에 놔 주세요.' },
                      { value: 'option4', label: '배송 전 연락 바랍니다.' },
                      { value: 'option5', label: '파손의 위험이 있는 상품입니다. 배송 시 주의해 주세요.' },
                    ]}
                    className="border border-gray-300 rounded"
                    placeholder="배송 시 요청사항을 선택해 주세요"
                    onChange={handleDeliveryNoteChange}
                    styles={{
                      menu: provided => ({
                        ...provided,
                        zIndex: 9999,
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected ? '#f0f0f0' : 'white',
                        color: 'black',
                        fontSize: '1rem',
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                        },
                      }),
                      control: provided => ({
                        ...provided,
                        fontSize: '1rem',
                      }),
                    }}
                  />

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
              <Link to="/mypage">
                <span className="text-gray-700 font-bold">변경</span>
              </Link>
            </button>
          </div>
          <div className="flex mb-2">
            <div className="text-white font-bold text-2xl mr-3">{/* 배송지 이름 */}</div>
          </div>
          <div className="text-white text-xl">{userInfo.address}</div>
          <div className="text-white text-xl">{userInfo.name} {userInfo.phone}</div>
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
                <div>
                  <div className="text-white text-xl font-bold">{product.name}</div>
                  <div className="text-white text-xl">{(product.price * quantity).toLocaleString()}원</div>
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
                <div className="text-white font-bold text-xl">{(product.price * quantity).toLocaleString()}원</div>
              </div>
              <div className="flex justify-between mb-5">
                <div className="text-white text-xl">배송비</div>
                <div className="text-white font-bold text-xl">3,000원</div>
              </div>
              <div className="border-lime-300 border-b"></div>
              <div className="flex justify-between pt-5">
                <div className="text-white font-bold text-2xl">최종 결제금액</div>
                <div className="text-white font-bold text-2xl">{(product.price * quantity + 3000).toLocaleString()}원</div> {/* 수량에 따른 최종 가격 표시 */}
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
          {(product && product.price) ? `${((product.price * quantity) + 3000).toLocaleString()}원 결제하기` : '결제하기'}
        </button>
      </div>
    </div>
  );
}
export default MarketPay;