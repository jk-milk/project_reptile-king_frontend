import { MdEdit, MdDelete } from 'react-icons/md';

interface PaymentCardProps {
  cardType: string;
  lastFourDigits: string;
  cardHolder: string;
  expirationDate: string;
  isDefault: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  lastFourDigits,
  cardHolder,
  expirationDate,
  isDefault,
  onEdit,
  onDelete
}) => {
  return (
    <div className="bg-black text-white p-4 rounded-lg shadow-md w-80">
      <div className="flex justify-between items-center mb-4">
        {/* <img src={`/path-to-${cardType}-logo.png`} alt={cardType} className="h-8" /> */}
        <span className="text-xl font-bold">下4桁 {lastFourDigits}</span>
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm">{cardHolder}</span>
        <span className="text-sm">{expirationDate}</span>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className={`w-4 h-4 rounded-full ${isDefault ? 'bg-red-500' : 'bg-gray-400'} mr-2`}></div>
          <span className="text-sm">{isDefault ? '通常利用' : '未設定'}</span>
        </div>
        <div className="flex space-x-2">
          <button onClick={onEdit} className="p-1 hover:bg-gray-700 rounded">
            <MdEdit className="h-5 w-5" />
          </button>
          <button onClick={onDelete} className="p-1 hover:bg-gray-700 rounded">
            <MdDelete className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;
