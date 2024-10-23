import React, { useState } from 'react';
import { CardData } from '../../types/Payment';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCard: (cardData: CardData) => void;
}

const AddCardModal: React.FC<AddCardModalProps> = ({ isOpen, onClose, onAddCard }) => {
  const [cardData, setCardData] = useState<CardData>({
    name: '',
    number: '',
    month: '',
    year: '',
    is_default: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCardData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCard(cardData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">新しいクレジットカードを追加</h2>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">カード名義人 *</label>
            <input
              type="text"
              name="name"
              value={cardData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">カード番号 *</label>
            <input
              type="text"
              name="number"
              value={cardData.number}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex mb-4">
            <div className="w-1/2 mr-2">
              <label className="block mb-2">月(月2桁) *</label>
              <input
                type="text"
                name="month"
                value={cardData.month}
                onChange={handleChange}
                placeholder="MM"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="w-1/2 ml-2">
              <label className="block mb-2">年(年2桁) *</label>
              <input
                type="text"
                name="year"
                value={cardData.year}
                onChange={handleChange}
                placeholder="YY"
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_default"
                checked={cardData.is_default}
                onChange={handleChange}
                className="mr-2"
              />
              通常利用
            </label>
          </div>
          <button type="submit" className="w-full bg-red-600 text-white p-2 rounded">
            追加する
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCardModal;
