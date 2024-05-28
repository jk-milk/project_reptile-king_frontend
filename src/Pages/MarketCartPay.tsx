import { useEffect, useState } from 'react';
import Select from 'react-select';
import * as idb from 'idb';
import { ProductItem } from "../types/Market";
import { apiWithAuth } from '../components/common/axios';
import { API } from '../config';

function MarketCartPay() {
  const [selectedProducts, setSelectedProducts] = useState<ProductItem[]>([]);
  const [totalSelectedItems, setTotalSelectedItems] = useState<number>(0);
  const [totalProductPrice, setTotalProductPrice] = useState<number>(0);
  const [cartOrderInfo, setCartOrderInfo] = useState({
    name: '',
    email: '',
    emailDomain: '',
    phoneNumber: '',
    deliveryNote: ''
  });

  const [selectedCartDeliveryNote, setSelectedCartDeliveryNote] = useState('');

  useEffect(() => {
    const storedOrderInfo = localStorage.getItem('cartOrderInfo');
    if (storedOrderInfo) {
      setCartOrderInfo(JSON.parse(storedOrderInfo));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCartOrderInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDeliveryNoteChange = (selectedOption) => {
    setSelectedCartDeliveryNote(selectedOption.label);
    setCartOrderInfo(prevState => ({
      ...prevState,
      deliveryNote: selectedOption.label
    }));
  };

  const userId = (() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    const [, payloadBase64] = token.split(".");
    const payload = JSON.parse(atob(payloadBase64));
    return payload.sub;
  })();

  useEffect(() => {
    const storedSelectedItems = localStorage.getItem('selectedItems');
    if (storedSelectedItems) {
      const selectedItems: number[] = JSON.parse(storedSelectedItems);
      setTotalSelectedItems(selectedItems.length);

      const fetchSelectedProducts = async () => {
        try {
          const db = await idb.openDB(`cart_${userId}`, 1);
          const tx = db.transaction('cart', 'readonly');
          const store = tx.objectStore('cart');
          const selectedProductsPromises = selectedItems.map(async (productId) => {
            return await store.get(productId);
          });
          const selectedProducts = await Promise.all(selectedProductsPromises);
          const filteredProducts = selectedProducts.filter(product => product !== undefined);
          setSelectedProducts(filteredProducts);

          const totalProductPrice = filteredProducts.reduce((total, product) => {
            return total + product.price;
          }, 0);
          setTotalProductPrice(totalProductPrice);

          // Store selected products in local storage
          localStorage.setItem('selectedProducts', JSON.stringify(filteredProducts));
        } catch (error) {
          console.error('Error fetching selected products:', error);
        }
      };
      fetchSelectedProducts();
    }
  }, [userId]);

  useEffect(() => {
    if (selectedProducts.length > 0) {
      localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
    }
  }, [selectedProducts]);

  const sendPurchaseRequest = async () => {
    try {
      const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts'));

      const purchases = selectedProducts.map((product, index) => ({
        good_id: product.id,
        total_price: index === 0 ? product.price + 3000 : product.price,
        quantity: product.quantity,
        payment_selection: '카드결제'
      }));

      const response = await apiWithAuth.post(`${API}purchases`, purchases);

      console.log('Purchase request sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending purchase request:', error);
    }
  };
  
  const handleOrder = async () => {
    try {
      localStorage.setItem('cartOrderInfo', JSON.stringify(cartOrderInfo));
      await sendPurchaseRequest();
      const confirmation = window.confirm("해당 상품을 구매하시겠습니까?");
      if (confirmation) {
        window.location.href = "/market/cart/pay/success";
      }
    } catch (error) {
      console.error('Error during purchase request:', error);
    }
  };

  return (
    <div className="pt-10 pb-10 mx-auto max-w-screen-md">
      <div className="text-white font-bold text-4xl pb-5">주문/결제</div>

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
                    value={cartOrderInfo.name}
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
                    value={cartOrderInfo.email}
                    onChange={handleInputChange}
                    className="bg-green-700 border border-lime-300 rounded text-white w-60 px-1 py-1 focus:outline-none mb-4 mr-1"
                  />
                  @
                  <select
                    name="emailDomain"
                    value={cartOrderInfo.emailDomain}
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
                    value={cartOrderInfo.phoneNumber}
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
            <div className="text-white font-bold text-2xl">주문상품</div>
            <div className="text-white text-xl">{totalSelectedItems}건</div>
          </div>
          {selectedProducts.map((product) => (
            <div key={product.id} className="bg-lime-950 rounded-xl px-5 py-4 border-2 border-lime-300 mt-4">
              <div className="flex items-center">
                <div>
                  <img src={product.imageUrl} alt={product.name} className="rounded-md h-20 w-20 mr-4" />
                </div>
                <div>
                  <div className="text-white text-xl font-bold">{product.name}</div>
                  <div className="flex items-center flex-wrap">
                    <div className="text-white text-xl mr-4">{product.price.toLocaleString()}원</div>
                    <div className="text-white text-xl font-bold">{product.quantity}개</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 상품금액 */}
      <div className="bg-green-700 rounded-xl border-2 border-lime-300 mt-5">
        <div className="px-5 py-4">
          <div className="text-white font-bold text-2xl mb-4">결제금액</div>
          <div>
            <div className="flex justify-between mb-3">
              <div className="text-white text-xl">총 상품금액</div>
              <div className="text-white font-bold text-xl">{totalProductPrice.toLocaleString()}원</div>
            </div>
            <div className="flex justify-between mb-5">
              <div className="text-white text-xl">배송비</div>
              <div className="text-white font-bold text-xl">3,000원</div>
            </div>
            <div className="border-lime-300 border-b"></div>
            <div className="flex justify-between pt-5">
              <div className="text-white font-bold text-2xl">최종 결제금액</div>
              <div className="text-white font-bold text-2xl">{(totalProductPrice + 3000).toLocaleString()}원</div>
            </div>
          </div>
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
          {(totalProductPrice + 3000).toLocaleString()}원 결제하기
        </button>
      </div>
    </div>
  );
}
export default MarketCartPay;