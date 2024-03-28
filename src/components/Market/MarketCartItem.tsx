import { IoMdRemove, IoMdAdd } from 'react-icons/io';

interface Product {
  id: number;
  name: string; 
  price: number;
  imageUrl: string;
}

interface MarketCartItemProps {
  product: Product;
  checked: boolean;
  setChecked: (isChecked: boolean) => void;
  onDelete: () => void;
  selectedQuantity: number; // 추가: 선택된 수량을 받아올 props
  onQuantityChange: (quantity: number) => void; // 선택된 수량 변경 이벤트 핸들러 추가
}

const MarketCartItem: React.FC<MarketCartItemProps> = ({ product, checked, setChecked, onDelete, selectedQuantity, onQuantityChange }) => {
  const calculatePrice = () => {
    return product.price * selectedQuantity; // 선택된 수량에 따라 가격 계산
  };

  const handleCheckboxChange = () => {
    setChecked(!checked);
  };

  const confirmDelete = () => {
    const isConfirmed = window.confirm('선택하신 상품을 장바구니에서 삭제하시겠습니까?');
    if (isConfirmed) {
      onDelete();
    }
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
          <button onClick={() => onQuantityChange(selectedQuantity - 1)} className="bg-gray-200 text-black p-1 rounded-full focus:outline-none">
            <IoMdRemove size={16} />
          </button>
          <div className="text-xl text-white mx-2">{selectedQuantity}</div>
          <button onClick={() => onQuantityChange(selectedQuantity + 1)} className="bg-gray-200 text-black p-1 rounded-full focus:outline-none">
            <IoMdAdd size={16} />
          </button>
        </div>
        <div className="text-xl text-white font-bold">{calculatePrice().toLocaleString()}원</div>
      </div>
      <button onClick={confirmDelete} className="ml-auto bg-yellow-400 text-gray-700 font-bold p-2 rounded-full hover:bg-yellow-200 transition-colors duration-200 focus:outline-none">
        삭제
      </button>
    </div>
  );
};

export default MarketCartItem;
