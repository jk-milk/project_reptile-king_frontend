import { useState, useEffect } from 'react';
import { apiWithAuth } from "../components/common/axios";
import MypageCategory from "../components/Mypage/MypageCategory";
import PaymentCard from "../components/Mypage/PaymentCard";
import AddCardModal from "../components/Mypage/AddCardModal";
import { CardData, Payment, ApiResponseWithData, ApiResponseWithoutData } from '../types/Payment';

function MypagePaymentMethod() {
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("マイページ");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiWithAuth.get<ApiResponseWithData<Payment[]>>('/users/payments');
      console.log('Fetch Payments Response:', response);
      
      if (response.data.data && Array.isArray(response.data.data)) {
        setPayments(response.data.data);
      } else {
        setPayments([]);
        console.warn('Received unexpected data format for payments');
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('お支払い方法の読み込みに失敗しました。');
      setPayments([]);
    }
    setIsLoading(false);
  };

  const handleAddCard = async (cardData: CardData): Promise<void> => {
    try {
      const response = await apiWithAuth.post<ApiResponseWithoutData>('/users/payments', cardData);
      console.log(response);
      
      if (response.data.msg === '등록 완료') {
        fetchPayments();
        setIsModalOpen(false);
      } else {
        setError(response.data.msg);
      }
    } catch (err) {
      setError(err.response?.data?.msg || '카드 추가에 실패했습니다.');
      console.error('Error adding card:', err);
    }
  };

  const handleEditCard = async (id: string, cardData: Partial<CardData>): Promise<void> => {
    try {
      const response = await apiWithAuth.put<ApiResponseWithoutData>(`/users/payments/${id}`, cardData);
      console.log(response);
      
      if (response.data.msg === '수정 완료') {
        fetchPayments();
      } else {
        setError(response.data.msg);
      }
    } catch (err) {
      setError(err.response?.data?.msg || '카드 수정에 실패했습니다.');
      console.error('Error updating card:', err);
    }
  };

  const handleDeleteCard = async (id: string): Promise<void> => {
    try {
      const response = await apiWithAuth.delete<ApiResponseWithoutData>(`/users/payments/${id}`);
      console.log(response);
      
      if (response.data.msg === '삭제 완료') {
        fetchPayments();
      } else {
        setError(response.data.msg);
      }
    } catch (err) {
      setError(err.response?.data?.msg || '카드 삭제에 실패했습니다.');
      console.error('Error deleting card:', err);
    }
  };

  return (
    <div className="pt-10 pb-10 laptop:w-[67.5rem] w-body m-auto">
      <div className="bg-white rounded px-5 py-4 flex">
        <div className="w-1/4 px-4">
          <MypageCategory
            selectedSubCategory={selectedSubCategory}
            setSelectedSubCategory={setSelectedSubCategory}
          />
        </div>
        <div className="w-3/4 px-4">
          <div className="bg-white rounded px-8 py-4">
            <h2 className="text-2xl font-bold mb-6">お支払い方法</h2>
            {isLoading ? (
              <p>ロード中...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : payments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {payments.map((payment) => (
                  <PaymentCard
                    key={payment.id}
                    id={payment.id}
                    lastFourDigits={payment.number.slice(-4)}
                    cardHolder={payment.name}
                    expirationDate={`${payment.month}/${payment.year}`}
                    isDefault={payment.is_default}
                    onEdit={(cardData) => handleEditCard(payment.id, cardData)}
                    onDelete={() => handleDeleteCard(payment.id)}
                  />
                ))}
              </div>
            ) : (
              <p>登録されている支払い方法がありません。</p>
            )}
            <div className="flex justify-center">
              <button 
                className="w-80 py-2 px-4 border border-gray-300 rounded-lg text-center"
                onClick={() => setIsModalOpen(true)}
              >
                + 新しいカードを追加する
              </button>
            </div>
          </div>
        </div>
      </div>
      <AddCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddCard={handleAddCard}
      />
    </div>
  );
}

export default MypagePaymentMethod;
