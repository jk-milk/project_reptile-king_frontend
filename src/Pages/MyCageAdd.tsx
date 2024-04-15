import { useState } from 'react';

function MyCageAdd() {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

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
    window.location.href = '/my-cage';
  };

  const handleSubmit = () => {
    const confirmSubmit = window.confirm('사육장 등록을 완료하시겠습니까?');
    if (confirmSubmit) {
      window.location.href = '/my-cage';
    }
  };

  return (
    <div>
      <div className="pt-10 pb-10 mx-auto max-w-screen-lg">
        <div className="bg-white rounded-lg shadow-md px-5 py-4">
          <div className="font-bold text-3xl mb-3">사육장 등록</div>
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
                      placeholder="사육장 이름을 입력해 주세요..."
                    ></input>
                  </td>
                </tr>
                <tr>
                  <td className="w-1/4 text-lg text-center">
                    파충류 선택
                  </td>
                  <td>
                    <select className="w-1/6 h-10 p-2 border border-gray-300 rounded mb-2">
                      <option>은별이</option>
                      <option>미란이</option>
                    </select>
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
                <tr>
                  <td className="w-1/4 text-lg text-center">메모</td>
                  <td>
                    <textarea
                      className="w-full h-40 border border-gray-300 rounded-md p-2 focus:outline-none mt-3 mb-3"
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
    </div>
  );
}

export default MyCageAdd;
