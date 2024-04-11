const MypageOrderContactItem = ({ order, transaction }) => {
  return (
    <div key={order.id} className="border-2 rounded px-5 py-4 flex items-center justify-between">
      <div>
        <div className="font-bold text-xl">{transaction.status}</div>
        <div className="text-lg mt-1">주문일: {order.deliveryDate}</div>
        <div className="text-lg mt-1">접수일: {transaction.statusDate}</div>
        <div className="flex items-center mt-2">
          <div>
            <img
              src={order.productImgUrl}
              alt={order.productName}
              className="w-16 h-16 rounded-full"
            />
          </div>
          <div className="ml-4 text-lg">
            <div>{order.productName}</div>
            <div className="flex items-center mt-1">
              <div>{order.productPrice.toLocaleString()}원</div>
              <div className="ml-3">{order.productQuantity}개</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MypageOrderContactItem;
