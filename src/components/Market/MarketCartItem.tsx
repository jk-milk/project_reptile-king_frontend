import { useEffect, useState } from 'react';
import { IoMdRemove, IoMdAdd } from 'react-icons/io';
import { ProductItem } from '../../types/Market';
import * as idb from 'idb';

interface MarketCartItemProps {
  product: ProductItem;
  checked: boolean;
  setChecked: (isChecked: boolean) => void;
  onDelete: (productId: number) => void;
  onQuantityChange: (productId: number, newQuantity: number) => void;
}

const MarketCartItem: React.FC<MarketCartItemProps> = ({ product, checked, setChecked, onDelete, onQuantityChange }) => {
  const [selectedQuantity, setSelectedQuantity] = useState<number>(product.quantity);
  const [price, setPrice] = useState<number>(product.originalPrice * product.quantity);

  // userId 변수 정의
  const userId = (() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    const [, payloadBase64] = token.split(".");
    const payload = JSON.parse(atob(payloadBase64));
    return payload.sub; // 'sub' 필드가 사용자 ID를 나타냄
  })();

  useEffect(() => {
    // 상품의 수량이 변경될 때마다 IndexedDB에 업데이트
    const updateQuantityInDB = async () => {
      try {
        const db = await idb.openDB(`cart_${userId}`, 2); // 개별 사용자의 장바구니 데이터베이스를 엽니다.
        const tx = db.transaction('cart', 'readwrite'); // 'cart' 객체 저장소에 대한 트랜잭션 시작
        const store = tx.objectStore('cart'); // 'cart' 객체 저장소에 대한 참조 가져오기
        await store.put({ ...product, quantity: selectedQuantity, price: price }); // 새로운 수량, 가격으로 업데이트
        await tx.oncomplete; // 트랜잭션 완료
      } catch (error) {
        console.error('개별 사용자의 장바구니 데이터베이스에서 상품 수량과 가격을 업데이트하는 중 에러가 발생했습니다:', error);
      }
    };
    updateQuantityInDB();
  }, [product, selectedQuantity, price, userId]); // selectedQuantity가 변경될 때마다 실행

  const calculatePrice = () => {
    return product.originalPrice * selectedQuantity; // Use originalPrice for calculation
  };

  const handleCheckboxChange = () => {
    setChecked(!checked);
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm('選択した商品をカートから削除しますか？');
    if (isConfirmed) {
      // 화면에서 상품 삭제
      onDelete(product.id);

      // IndexedDB에서 해당 상품을 삭제합니다.
      try {
        const db = await idb.openDB(`cart_${userId}`, 2);
        const tx = db.transaction('cart', 'readwrite');
        const store = tx.objectStore('cart');
        await store.delete(product.id); // 해당 상품을 ID로 삭제
        await tx.oncomplete;
        console.log('상품이 IndexedDB에서 삭제되었습니다.');
      } catch (error) {
        console.error('개별 사용자의 장바구니 데이터베이스에서 상품을 삭제하는 중 에러가 발생했습니다:', error);
      }
    }
  };

  const handleDecrease = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity(selectedQuantity - 1);
      setPrice(product.originalPrice * (selectedQuantity - 1)); // 새로운 가격 계산
      onQuantityChange(product.id, selectedQuantity - 1); // 상품 ID 및 새 수량 전달
    }
    window.location.reload();
  };

  const handleIncrease = () => {
    setSelectedQuantity(selectedQuantity + 1);
    setPrice(product.originalPrice * (selectedQuantity + 1)); // 새로운 가격 계산
    onQuantityChange(product.id, selectedQuantity + 1); // 상품 ID 및 새 수량 전달
    window.location.reload();
  };

  return (
    <div className="flex items-center px-5 py-4 border-t border-lime-300">
      <input
        type="checkbox"
        className="mr-4 h-5 w-5 border-gray-300 rounded checked:border-transparent"
        checked={checked}
        onChange={handleCheckboxChange}
      />
      <img src={product.imageUrl} alt="Product" className="rounded-md h-20 w-20 mr-4" />
      <div className="flex flex-col">
        <div className="text-lg text-white font-semibold mb-1">{product.name}</div>
        <div className="flex items-center mb-2">
          <button onClick={handleDecrease} className="bg-gray-200 text-black p-1 rounded-full focus:outline-none">
            <IoMdRemove size={16} />
          </button>
          <div className="text-xl text-white mx-2">{selectedQuantity}</div>
          <button onClick={handleIncrease} className="bg-gray-200 text-black p-1 rounded-full focus:outline-none">
            <IoMdAdd size={16} />
          </button>
        </div>
        <div className="text-xl text-white font-bold">{calculatePrice().toLocaleString()}円</div>
      </div>
      <button onClick={handleDelete} className="ml-auto bg-yellow-400 text-gray-700 font-bold p-2 rounded-full hover:bg-yellow-200 transition-colors duration-200 focus:outline-none">
      削除
      </button>
    </div>
  );
};

export default MarketCartItem;
