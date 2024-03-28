import { useState } from "react";
import MarketCartItem from "../components/Market/MarketCartItem";
import { products } from "../../src/Pages/Product";

function MarketCart() {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [deletedItems, setDeletedItems] = useState<number[]>([]); // 삭제된 상품을 관리하는 상태 추가
  const [selectedQuantities, setSelectedQuantities] = useState<{ [productId: number]: number }>({});

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allProductIds = products.map((product) => product.id);
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

  // 상품 삭제 함수
  const handleDeleteItem = (productId: number) => {
    setSelectedItems(selectedItems.filter((id) => id !== productId));
    setDeletedItems([...deletedItems, productId]); // 삭제된 상품을 추가
  };

  // 선택된 상품의 총 가격 계산
  const calculateTotalPrice = () => {
    let totalPrice = 0;
    selectedItems.forEach((itemId) => {
      const item = products.find((product) => product.id === itemId);
      if (item && !deletedItems.includes(itemId)) {
        const selectedQuantity = selectedQuantities[itemId] || 1; // 선택된 수량
        totalPrice += item.price * selectedQuantity; // 가격 * 수량
      }
    });
    return totalPrice;
  };

  // 주문금액 계산
  const calculateOrderTotal = () => {
    const totalPrice = calculateTotalPrice(); // 기존 상품금액 계산 함수 호출
    const orderTotal = totalPrice + 3000; // 배송비 3,000원 추가
    return orderTotal;
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    setSelectedQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: newQuantity
    }));
  };

  const handlePayClick = () => {
    window.location.href = "/market/Pay";
  };

  return (
    <div className="pt-10 pb-10 mx-auto max-w-screen-xl">
      <div className="text-white font-bold text-4xl pb-5">장바구니</div>
      <div className="grid grid-cols-12 gap-4">

        {/* 왼쪽 */}
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
            {products.map((product) => (
              // 삭제된 상품은 제외
              !deletedItems.includes(product.id) && (
                <MarketCartItem
                  key={product.id}
                  product={product}
                  checked={selectedItems.includes(product.id)}
                  setChecked={(isChecked) => handleCheckedChange(product.id, isChecked)}
                  onDelete={() => handleDeleteItem(product.id)} // 삭제 함수 전달
                  selectedQuantity={selectedQuantities[product.id] || 1} // 선택된 수량을 전달
                  onQuantityChange={(newQuantity) => handleQuantityChange(product.id, newQuantity)} // 선택된 상품의 수량 변경 함수 전달
                />
              )
            ))}
          </div>
        </div>

        {/* 오른쪽 */}
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
