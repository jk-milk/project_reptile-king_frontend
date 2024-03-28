import { useSearchParams } from "react-router-dom"
import { products } from './Product';

export function MarketPaySuccess() {
  const [searchParams] = useSearchParams();
  const product = products[0];

  const handlePayClick = () => {
    window.location.href = "/market";
  };

  return (
    <div>
      <div className="pt-10 pb-10 mx-auto max-w-screen-md">

        {/* 주문완료 */}
        <div className="text-white font-bold text-4xl pb-5">주문완료</div>
        <div className="bg-green-700 rounded-xl border-2 border-lime-300 py-10">
          <div className="text-white font-bold text-center text-3xl">주문이 완료되었습니다. 감사합니다!</div>
        </div>

        {/* 주문정보 */}
        <div className="text-white font-bold text-4xl mt-10 pb-5">주문정보</div>
        <div className="bg-green-700 rounded-xl border-2 border-lime-300 px-5 py-4">
          <div className="flex justify-between mb-4">
            <div className="text-white font-bold text-xl">주문상품</div>
            <div className="text-white font-bold text-xl">1개</div>
          </div>
          <div className="bg-lime-950 rounded-xl px-5 py-4 border-2 border-lime-300">
            <div className="flex items-center">
              <div>
                <img src={product.imageUrl} alt={product.name} className="rounded-md h-20 w-20 mr-4" />
              </div>
              <div className="text-white text-xl font-bold">
                <div>{`${searchParams.get("orderId")}`}</div>
                <div>{`${Number(
                  searchParams.get("amount")
                ).toLocaleString()}원`}</div>
              </div>
            </div>
            <div className="border-lime-300 border-b mt-5 mb-5"></div>
            <div className="text-white text-xl text-center mb-1">총 결제금액</div>
            <div className="text-white font-bold text-2xl text-center">
              {`${Number(
                searchParams.get("amount")
              ).toLocaleString()}원`}</div>
          </div>
        </div>
        <div className="flex justify-center mt-10">
          <button className="bg-gray-600 hover:bg-gray-800 border text-white font-bold text-xl w-56 py-2 rounded-lg mr-6">주문내역 확인</button>
          <button className="bg-pink-700 hover:bg-pink-900 border text-white font-bold text-xl w-56 py-2 rounded-lg" onClick={handlePayClick}>마켓으로</button>
        </div>
      </div>
    </div>
  )
}

export default MarketPaySuccess;
