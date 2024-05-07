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
    const fetchCartItems = async () => {
      try {
        const db = await idb.openDB('market', 1);
        const cartItems = await db.getAll('cart');
        setCartItems(cartItems);
      } catch (error) {
        console.error('장바구니 상품을 불러오는 중 에러가 발생했습니다:', error);
      }
    };
    fetchCartItems();
  }, []);

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
      const db = await idb.openDB('market', 1);
      await db.put('cart', { ...cartItems.find(item => item.id === productId), quantity: newQuantity }); // 새로운 수량으로 업데이트
      const updatedCartItems = cartItems.map(item => {
        if (item.id === productId) {
          return { ...item, quantity: newQuantity }; // 해당 상품의 수량만 업데이트
        }
        return item;
      });
      setCartItems(updatedCartItems); // 업데이트된 상품 목록으로 상태 업데이트
    } catch (error) {
      console.error('IndexedDB에서 상품 수량을 업데이트하는 중 에러가 발생했습니다:', error);
    }
  };

  const handlePayClick = () => {
    window.location.href = "/market/Pay";
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
