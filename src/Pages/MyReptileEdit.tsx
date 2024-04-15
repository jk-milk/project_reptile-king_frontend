import { useState } from 'react';
import { reptile } from './MyCage';

function MyReptileEdit() {
  const [repName, setRepName] = useState(reptile[0].repName);
  const [repAge, setRepAge] = useState(reptile[0].repAge);
  const [repType, setRepType] = useState(reptile[0].repType);
  const [repImage, setRepImage] = useState(reptile[0].repImage);
  const [repMemo, setRepMemo] = useState(reptile[0].repMemo);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const images = Array.from(files).slice(0, 3 - uploadedImages.length);
      setUploadedImages(prevImages => [...prevImages, ...images]);
      images.forEach(image => {
        const reader = new FileReader();
        reader.onload = () => {
          const uploadedImageURL = reader.result as string;
          setRepImage(uploadedImageURL);
        };
        reader.readAsDataURL(image);
      });
    }
  };

  const handleCancel = () => {
    window.location.href = '/my-cage';
  };

  const handleSubmit = () => {
    const confirmSubmit = window.confirm('파충류 수정을 완료하시겠습니까?');
    if (confirmSubmit) {
      window.location.href = '/my-cage';
    }
  };

  return (
    <div className="pt-10 pb-10 mx-auto max-w-screen-lg">
      <div className="bg-white rounded-lg shadow-md px-5 py-4">
        <div className="font-bold text-3xl mb-3">파충류 수정</div>
        <div className="flex items-center mt-2">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="w-1/4 text-lg text-center">
                  이름
                </td>
                <td>
                  <input
                    type="text"
                    className="w-full h-10 p-2 border border-gray-300 rounded mt-2 mb-2"
                    value={repName}
                    onChange={(e) => setRepName(e.target.value)}
                  ></input>
                </td>
              </tr>
              <tr>
                <td className="w-1/4 text-lg text-center">
                  종
                </td>
                <td>
                  <input
                    type="text"
                    className="w-full h-10 p-2 border border-gray-300 rounded mt-2 mb-2"
                    value={repType}
                    onChange={(e) => setRepType(e.target.value)}
                  ></input>
                </td>
              </tr>
              <tr>
                <td className="w-1/4 text-lg text-center">
                  나이
                </td>
                <td>
                  <input
                    type="text"
                    className="w-full h-10 p-2 border border-gray-300 rounded mt-2 mb-2"
                    value={repAge}
                    // onChange={(e) => setRepAge(e.target.value)}
                  ></input>
                </td>
              </tr>
              <tr>
                <td className="w-1/4 text-lg text-center">이미지</td>
                <td>
                  <div className="flex items-center">
                    <div>
                      <button
                        className="hover:bg-blue-200 text-blue-500 border-2 border-blue-500 font-bold py-1 px-4 rounded"
                        onClick={() => document.getElementById('imageUpload')?.click()}
                        disabled={uploadedImages.length >= 3}
                      >
                        이미지 업로드
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
                    </div>
                  </div>
                  <div className="flex mt-3">
                    {uploadedImages.map((image, index) => (
                      <img key={index} src={URL.createObjectURL(image)} alt={`Uploaded Image ${index + 1}`} className="w-40 h-40 object-cover rounded mr-4" />
                    ))}
                  </div>
                  {repImage && (
                    <img
                      src={repImage}
                      alt="Cage"
                      className="w-40 h-40 object-cover rounded mt-3"
                    />
                  )}
                </td>
              </tr>
              <tr>
                <td className="w-1/4 text-lg text-center">메모</td>
                <td>
                  <textarea
                    className="w-full h-40 border border-gray-300 rounded-md p-2 focus:outline-none mt-3 mb-3"
                    value={repMemo}
                    onChange={(e) => setRepMemo(e.target.value)}
                    placeholder="메모를 입력해 주세요..."
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-3">
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
            등록
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyReptileEdit;
