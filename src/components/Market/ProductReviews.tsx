import StarRating from './StarRating';

const ProductReviews = () => {
  return (
    <div>
      <div className="bg-gray-100 p-4 border border-gray-300 rounded-sm">
        <div className="flex items-center mb-3">
          <img className="h-12 w-12 rounded-full" src="https://via.placeholder.com/150" alt="User Profile" />
          <div className="ml-2">
            <p className="text-black">바닐라아이스크림</p>
            <p className="text-gray-600 flex items-center">
              <span className="mr-2"><StarRating rating={4} /></span>
              2024.03.05
            </p>
          </div>
        </div>
        <img src="https://search.pstatic.net/sunny/?src=https%3A%2F%2Fdcimg6.dcinside.co.kr%2Fviewimage.php%3Fid%3D2eafd535f1d73ca16bbcddba1cde25%26no%3D24b0d769e1d32ca73fea8efa11d028317044ef0bb41aaa70c68a363cd5e68bbbabec03c927355cfc2fbfdc2d1f989af65a652991008024dbf7329b51584907482c48c21c465994ab6771c164f26b26bda201ca5c57793be095afec0fc0a57399c277d0e6593bd34ddaefb9c0d911c3&type=sc960_832" />
        <p className="text-gray-700 mt-2">우리 은별이가 너무 좋아합니다.</p>
      </div>
    </div>
  );
};

export default ProductReviews;
