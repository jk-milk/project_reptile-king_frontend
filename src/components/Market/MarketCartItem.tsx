import { useEffect, useState } from 'react';
import { IoMdRemove, IoMdAdd } from 'react-icons/io';
import { ProductItem } from '../../types/Market';
import * as idb from 'idb';

interface MarketCartItemProps {
  product: ProductItem;
  checked: boolean;
  setChecked: (isChecked: boolean) => void;
  onDelete: () => void;
  onQuantityChange: (productId: number, newQuantity: number) => void;
}

const MarketCartItem: React.FC<MarketCartItemProps> = ({ product, checked, setChecked, onDelete, onQuantityChange }) => {
  const [selectedQuantity, setSelectedQuantity] = useState<number>(product.quantity);
  const [price, setPrice] = useState<number>(product.originalPrice * product.quantity);

  useEffect(() => {
    // 상품의 수량이 변경될 때마다 IndexedDB에 업데이트
    const updateQuantityInDB = async () => {
      try {
        const db = await idb.openDB('market', 1);
        await db.put('cart', { ...product, quantity: selectedQuantity, price: price  }); // 새로운 수량으로 업데이트
      } catch (error) {
        console.error('IndexedDB에서 상품 수량과 가격을 업데이트하는 중 에러가 발생했습니다:', error);
      }
    };
    updateQuantityInDB();
  }, [product, selectedQuantity, price]); // selectedQuantity가 변경될 때마다 실행

  const calculatePrice = () => {
    return product.originalPrice * selectedQuantity; // Use originalPrice for calculation
  };

  const handleCheckboxChange = () => {
    setChecked(!checked);
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm('선택하신 상품을 장바구니에서 삭제하시겠습니까?');
    if (isConfirmed) {
      // IndexedDB에서 해당 상품을 삭제합니다.
      try {
        const db = await idb.openDB('market', 1);
        await db.delete('cart', product.id);
        console.log('상품이 IndexedDB에서 삭제되었습니다.');
        // 삭제된 상품의 ID를 부모 컴포넌트로 전달하여 UI를 업데이트합니다.
        onDelete(product.id);
      } catch (error) {
        console.error('IndexedDB에서 상품을 삭제하는 중 에러가 발생했습니다:', error);
      }
    }
  };

  const handleDecrease = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity(selectedQuantity - 1);
      setPrice(product.originalPrice * (selectedQuantity - 1)); // 새로운 가격 계산
      onQuantityChange(product.id, selectedQuantity - 1); // 상품 ID 및 새 수량 전달
      window.location.reload();
    }
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
        <div className="text-xl text-white font-bold">{calculatePrice().toLocaleString()}원</div>
      </div>
      <button onClick={handleDelete} className="ml-auto bg-yellow-400 text-gray-700 font-bold p-2 rounded-full hover:bg-yellow-200 transition-colors duration-200 focus:outline-none">
        삭제
      </button>
    </div>
  );
};

export default MarketCartItem;
