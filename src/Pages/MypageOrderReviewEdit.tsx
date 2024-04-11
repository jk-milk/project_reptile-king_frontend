import { useState } from 'react';
import MypageCategory from '../components/Mypage/MypageCategory';
import { orders } from '../Pages/MypageOrder';
import StarRating from '../components/Market/StarRating';
import { reviews } from '../components/Mypage/ReviewCompleteItem';

function MypageOrderReviewEdit() {
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('마이 페이지');
  const [userRating, setUserRating] = useState<number>(reviews[0].rating);
  const [reviewText, setReviewText] = useState<string>(reviews[0].reviewContent);
  const [reviewTitle, setReviewTitle] = useState<string>(reviews[0].reviewTitle);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const order = orders[0];

  const handleStarClick = (rating: number) => {
    setUserRating(rating);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewText(event.target.value);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReviewTitle(event.target.value);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (extension && !['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
          alert('JPG, PNG, GIF 파일만 업로드할 수 있습니다.');
          return;
        }
      }
      const images = Array.from(files);
      setUploadedImages(prevImages => [...prevImages, ...images.slice(0, 3 - prevImages.length)]);
    }
  };

  const handleCancel = () => {
    window.location.href = '/mypage/order/review';
  };

  const handleSubmit = () => {
    const confirmSubmit = window.confirm('리뷰 수정을 완료하시겠습니까?');
    if (confirmSubmit) {
      window.location.href = '/mypage/order/review';
    }
  };

  return (
    <div>
      <div className="pt-12 pb-24 mx-auto max-w-screen-xl flex">
        {/* 왼쪽 섹션 */}
        <div className="w-1/4 px-4">
          <MypageCategory
            selectedSubCategory={selectedSubCategory}
            setSelectedSubCategory={setSelectedSubCategory}
          />
        </div>
        {/* 오른쪽 섹션 */}
        <div className="w-3/4 px-4">
          <div className="bg-gray-200 rounded px-5 py-4">
            <div className="font-bold text-2xl mb-3">리뷰수정</div>
            <div className="bg-white rounded px-5 py-4 pb-6">
              <div className="border-2 rounded items-center px-4 py-3">
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={order.productImgUrl}
                      alt={order.productName}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="ml-4 text-lg">
                      <div>{order.productName}</div>
                      <div className="flex items-center mt-1">
                        <StarRating rating={userRating} onClick={handleStarClick} /> <span className="ml-1 text-sm">(필수)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center mt-2">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="w-1/4 text-lg text-center">상세내용</td>
                      <td>
                        <textarea
                          className="w-full h-60 p-2 border border-gray-300 rounded"
                          placeholder="리뷰를 작성해주세요..."
                          value={reviewText}
                          onChange={handleTextChange}
                        ></textarea>
                      </td>
                    </tr>
                    <tr>
                      <td className="w-1/4 text-lg text-center">
                        리뷰요약
                      </td>
                      <td>
                        <input
                          type="text"
                          className="w-full h-10 p-2 border border-gray-300 rounded mt-2 mb-2"
                          placeholder="요약을 작성해주세요..."
                          value={reviewTitle}
                          onChange={handleTitleChange}
                        ></input>
                      </td>
                    </tr>
                    <tr>
                      <td className="w-1/4 text-lg text-center">사진 첨부</td>
                      <td>
                        <button
                          className="hover:bg-blue-200 text-blue-500 border-2 border-blue-500 font-bold py-1 px-4 rounded"
                          onClick={() => document.getElementById('imageUpload')?.click()}
                          disabled={uploadedImages.length >= 3}
                        >
                          사진 첨부
                        </button>
                        <input
                          id="imageUpload"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                          multiple
                        />
                        <span className="ml-6">{uploadedImages.length}/3</span>
                        <span className="text-gray-400 text-sm ml-6">사진은 최대 20MB 이하의 JPG, PNG, GIF 파일 3장까지 첨부 가능합니다.</span>

                      </td>
                    </tr>
                    <tr>
                      <td>
                      </td>
                      <td>
                        {uploadedImages.length > 0 && (
                          <div className="flex mt-3">
                            {uploadedImages.map((image, index) => (
                              <img key={index} src={URL.createObjectURL(image)} alt={`Uploaded Image ${index + 1}`} className="w-52 h-40 mr-2" />
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  className="hover:bg-red-200 bg-red-500 text-white font-bold py-1 px-4 rounded mr-6 self-center"
                  onClick={handleCancel}
                >
                  취소
                </button>
                <button
                  className="hover:bg-blue-200 bg-blue-500 text-white font-bold py-1 px-4 rounded self-center"
                  onClick={handleSubmit}
                >
                  수정
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MypageOrderReviewEdit;
