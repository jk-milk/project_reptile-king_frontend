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

  const userId = (() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    const [, payloadBase64] = token.split(".");
    const payload = JSON.parse(atob(payloadBase64));
    return payload.sub; // 'sub' 필드가 사용자 ID를 나타냄
  })();

  useEffect(() => {
    const storedSelectedItems = localStorage.getItem('selectedItems');
    if (storedSelectedItems) {
      const selectedItems: number[] = JSON.parse(storedSelectedItems);
      setTotalSelectedItems(selectedItems.length); // 선택된 상품의 총 수량 설정
  
      // 해당 상품 ID에 맞는 상품 정보를 IndexedDB에서 가져와서 state에 저장
      const fetchSelectedProducts = async () => {
        try {
          const db = await idb.openDB(`cart_${userId}`, 1);
          const tx = db.transaction('cart', 'readonly');
          const store = tx.objectStore('cart');
          const selectedProductsPromises = selectedItems.map(async (productId) => {
            return await store.get(productId);
          });
          const selectedProducts = await Promise.all(selectedProductsPromises);
          setSelectedProducts(selectedProducts.filter(product => product !== undefined)); // undefined 제거
  
          // 총 상품금액 계산
          const totalProductPrice = selectedProducts.reduce((total, product) => {
            return total + product.price;
          }, 0);
          setTotalProductPrice(totalProductPrice);
        } catch (error) {
          console.error('선택된 상품 정보를 가져오는 중 에러가 발생했습니다:', error);
        }
      };
      fetchSelectedProducts();
    }
  }, [userId]);

  const sendPurchaseRequest = async () => {
    try {
      const productsData = selectedProducts.map(product => ({
        good_id: product.productId,
        total_price: product.price + 3000, // 상품 가격에 배송비 추가
        quantity: product.quantity,
        payment_selection: '카드결제', // 결제 수단 설정
      }));
      
      // 상품 정보를 담은 배열을 한 번에 보내는 방식으로 수정할 수도 있습니다.
      const response = await apiWithAuth.post(`${API}purchases`, productsData);
      console.log("Purchase API response:", response.data);
      if (response.status === 201) {
        alert("결제가 성공적으로 완료되었습니다.");
      }
    } catch (error) {
      console.error("구매 요청 중 에러 발생:", error);
    }
  };  

  const handleOrder = async () => {
    try {
      await sendPurchaseRequest();
      // window.location.href = `/market/pay/${productId}/success?price=${price}&quantity=${quantity}`;
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