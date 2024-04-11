import { useState } from 'react';
import MypageCategory from '../components/Mypage/MypageCategory';
import { orders } from '../Pages/MypageOrder';
import { inquiry } from '../components/Mypage/HelpCompleteItem';

function MypageHelpDetail() {
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('마이 페이지');
  const [inquiryText, setInquiryText] = useState<string>(inquiry[0].inquiryContent);
  const [inquiryTitle, setInquiryTitle] = useState<string>(inquiry[0].inquiryTitle);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const order = orders[0];

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInquiryText(event.target.value);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInquiryTitle(event.target.value);
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

  const handleReturn = () => {
    window.location.href = '/mypage/help';
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
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center mt-2">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="w-1/4 text-lg text-center">
                        문의 상황
                      </td>
                      <td>
                        <div className="mt-2 mb-2 text-lg font-semibold">{inquiry[0].inquiryStatus}</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="w-1/4 text-lg text-center">
                        제목
                      </td>
                      <td>
                        <div className="mt-2 mb-2 text-lg font-semibold">{inquiryTitle}</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="w-1/4 text-lg text-center">설명</td>
                      <td>
                        <div className="mt-2 mb-2 text-lg font-semibold">{inquiryText}</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="w-1/4 text-lg text-center">사진</td>
                      <td>
                        <div className="mt-2 mb-4">
                          <img
                            src={inquiry[0].inquiryImage}
                            alt={inquiry[0].inquiryImage}
                            className="w-full h-auto"
                          />
                        </div>
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

                    <tr>
                      <td className="w-1/4 text-lg text-center border-t border-gray-400 pt-4">답변</td>
                      <td className="text-lg font-semibold border-t border-gray-400 pt-4">
                        <div className="p-4 bg-gray-200 rounded-md">
                          [파충KING] 취소 접수건 관련 안내<br />
                          <br />
                          안녕하세요, 파충KING입니다.<br />
                          단순 변심으로 인한 취소 접수는 상품 출고 후에는 중단이 불가하기에 금일 배송은 기존대로 진행됩니다.<br />
                          <br />
                          ▶ 주문번호 : 20240411<br />
                          ▶ 접수내용 : 취소<br />
                          <br />
                          좋은 하루 되세요 :)<br />
                          기다려주셔서 감사합니다.
                        </div>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  className="hover:bg-blue-200 bg-blue-500 text-white font-bold py-1 px-4 rounded self-center"
                  onClick={handleReturn}
                >
                  목록으로 돌아가기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MypageHelpDetail;
