import { useState, useEffect } from "react";
import MarketCartItem from "../components/Market/MarketCartItem";
import * as idb from 'idb';
import { ProductItem } from "../types/Market";

function MarketCart() {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [deletedItems, setDeletedItems] = useState<number[]>([]);
  const [selectedQuantities, setSelectedQuantities] = useState<{ [productId: number]: number }>({});
  const [cartItems, setCartItems] = useState<ProductItem[]>([]);

  useEffect(() => {
    // 선택된 상품을 로컬 스토리지에 저장
    localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
  }, [selectedItems]);

  const userId = (() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    const [, payloadBase64] = token.split(".");
    const payload = JSON.parse(atob(payloadBase64));
    return payload.sub;
  })();

  useEffect(() => {
    const createCartDB = async () => {
      try {
        const db = await idb.openDB(`cart_${userId}`, 2, {
          upgrade(db) {
            if (!db.objectStoreNames.contains('cart')) {
              db.createObjectStore('cart', { keyPath: 'id' });
            }
          },
        });
        const tx = db.transaction('cart', 'readonly');
        const store = tx.objectStore('cart');
        const items = await store.getAll();
        setCartItems(items); // 데이터베이스에서 가져온 상품 목록을 상태로 설정
        console.log('사용자 개별 장바구니 DB에서 데이터를 가져왔습니다.');
      } catch (error) {
        console.error('사용자 개별 장바구니 DB에서 데이터를 가져오는 중 에러가 발생했습니다:', error);
      }
    };
  
    if (userId) { // 사용자 ID가 존재할 때만 데이터베이스에서 데이터 가져오도록 조건 추가
      createCartDB();
    }
  }, [userId]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allProductIds = cartItems.map((product) => product.id);
      setSelectedItems(allProductIds);
    } else {
      setSelectedItems([]);
    }
  };

  const handleCheckedChange = (productId: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedItems([...selectedItems, productId]);
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== productId));
    }
  };

  const handleDeleteItem = (productId: number) => {
    setSelectedItems(selectedItems.filter((id) => id !== productId));
    setDeletedItems([...deletedItems, productId]);
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    cartItems.forEach((item) => {
      if (selectedItems.includes(item.id)) {
        const selectedQuantity = selectedQuantities[item.id] || 1;
        totalPrice += item.price * selectedQuantity;
      }
    });
    return totalPrice;
  };

  const calculateOrderTotal = () => {
    const totalPrice = calculateTotalPrice();
    const orderTotal = totalPrice + 3000;
    return orderTotal;
  };

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    try {
      const db = await idb.openDB(`cart_${userId}`, 2); // 개별 사용자의 장바구니 데이터베이스를 열기
      await db.put('cart', { ...cartItems.find(item => item.id === productId), quantity: newQuantity }); // 새로운 수량으로 업데이트
      const updatedCartItems = cartItems.map(item => {
        if (item.id === productId) {
          return { ...item, quantity: newQuantity }; // 해당 상품의 수량만 업데이트
        }
        return item;
      });
      setCartItems(updatedCartItems); // 업데이트된 상품 목록으로 상태 업데이트
    } catch (error) {
      console.error('개별 사용자의 장바구니 데이터베이스에서 상품 수량을 업데이트하는 중 에러가 발생했습니다:', error);
    }
  };  

  const handlePayClick = () => {
    window.location.href = "/market/cart/pay";
  };

  return (
    <div className="pt-10 pb-10 mx-auto max-w-screen-xl">
      <div className="text-white font-bold text-4xl pb-5">장바구니</div>
      <div className="grid grid-cols-12 gap-4">

        <div className="col-span-8">
          <div className="bg-green-700 rounded-xl border-2 border-lime-300">
            <div className="flex items-center px-5 py-4">
              <input
                type="checkbox"
                className="mr-4 h-5 w-5 border-gray-300 rounded focus:ring-gray-400 checked:bg-blue-500 checked:border-transparent"
                checked={selectAll}
                onChange={handleSelectAll}
              />
              <div className="flex-1 text-left text-xl text-white font-bold">전체선택</div>
            </div>
            <div className="border-lime-300 border-b"></div>
            {cartItems.map((product) => (
              !deletedItems.includes(product.id) && (
                <MarketCartItem
                  key={product.id}
                  product={product}
                  checked={selectedItems.includes(product.id)}
                  setChecked={(isChecked) => handleCheckedChange(product.id, isChecked)}
                  onDelete={() => handleDeleteItem(product.id)}
                  selectedQuantity={selectedQuantities[product.id] || 1}
                  onQuantityChange={(newQuantity) => handleQuantityChange(product.id, newQuantity)}
                />
              )
            ))}
          </div>
        </div>

        <div className="col-span-4">
          <div className="bg-green-700 rounded-lg shadow-md border-2 border-lime-300 p-4">
            <div className="px-6 py-4">
              <div className="flex justify-between items-center mb-4">
                <div className="text-white text-2xl">상품금액</div>
                <div className="text-white text-2xl font-bold">{calculateTotalPrice().toLocaleString()}원</div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <div className="text-white text-2xl">배송비</div>
                <div className="text-white text-2xl font-bold">3,000원</div>
              </div>
              <div className="border-lime-300 border-b mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="text-white text-2xl">주문금액</div>
                <div className="text-white text-2xl font-bold">{calculateOrderTotal().toLocaleString()}원</div>
              </div>
            </div>
          </div>
          <button className="bg-pink-700 hover:bg-pink-900 border-2 text-white font-bold text-2xl py-4 rounded-lg mt-4 w-full" onClick={handlePayClick}>바로구매</button>
        </div>
      </div>
    </div>
  );
}

export default MarketCart;
