import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Reptile } from '../types/Cage';
import ImageWithDeleteButton from '../components/Board/ImageWithDeleteButton';
import { apiWithAuth } from '../components/common/axios';
import { API } from '../config';

function MyReptileEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state.id;
  console.log(location.state);

  useEffect(() => {
    const fetchReptile = async () => {
      setReptile(location.state);
      setName(location.state.name);
      setBirth(location.state.birth)
      setSpecies(location.state.species);
      setGender(location.state.gender);
      if (location.state.memo !== null)
        setMemo(location.state.memo);
      setImgUrls(location.state.img_urls || []);
    };
    fetchReptile();

  }, [location.state]);

  const [reptile, setReptile] = useState<Reptile>();
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [species, setSpecies] = useState('');
  const [gender, setGender] = useState('');
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const [memo, setMemo] = useState('');
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      // 새로 업로드할 수 있는 이미지 개수를 계산 (최대 3개 - 기존 이미지 개수)
      const availableSlots = 3 - imgUrls.length;
      const filesToAdd = filesArray.slice(0, availableSlots);
      setUploadedImages([...uploadedImages, ...filesToAdd]);
    }
  };

  const handleCancel = () => {
    const confirmCancel = confirm('파충류 수정을 취소하시겠습니까?');
    if (confirmCancel)
      navigate('/my-cage');
  };

  const handleSubmit = async () => {
    const confirmSubmit = window.confirm('파충류 수정을 완료하시겠습니까?');
    if (confirmSubmit) {
      const formData = new FormData();

      formData.append('name', name);
      formData.append('species', species);
      formData.append('gender', gender);
      formData.append('birth', birth);
      formData.append('memo', memo);

      if (imgUrls.length === 0)
        formData.append('imgUrls[]', '');
      else {
        imgUrls.forEach(url => {
          formData.append('imgUrls[]', url);
        });
      }

      uploadedImages.forEach(image => {
        formData.append('images[]', image);
      });

      formData.append('_method', 'PATCH');

      const response = await apiWithAuth.post(`${API}reptiles/${id}`, formData);
      console.log(response);
      
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    let month = '' + (date.getMonth() + 1), // getMonth()는 0부터 시작
        day = '' + date.getDate();
    const year = date.getFullYear();
        
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
  
    return [year, month, day].join('-'); // 'yyyy-MM-dd' 형식
  };

  // 기존 이미지 삭제
  const handleDeleteExistingImage = (indexToDelete: number) => {
    setImgUrls((prev) => prev.filter((_, index) => index !== indexToDelete));
  };

  // 새로 업로드된 이미지 삭제
  const handleDeleteUploadedImage = (indexToDelete: number) => {
    setUploadedImages((prev) => prev.filter((_, index) => index !== indexToDelete));
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                  ></input>
                </td>
              </tr>
              <tr>
                <td className="w-1/4 text-lg text-center">
                  생년월일
                </td>
                <td>
                  <input
                    type="date"
                    className="w-full h-10 p-2 border border-gray-300 rounded mt-2 mb-2"
                    value={formatDate(birth)}
                    onChange={(e) => setBirth(e.target.value)}
                  ></input>
                </td>
              </tr>
              <tr>
                <td className="w-1/4 text-lg text-center">
                  성별
                </td>
                <td>
                  <input
                    type="text"
                    className="w-full h-10 p-2 border border-gray-300 rounded mt-2 mb-2"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
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
                        disabled={imgUrls.length + uploadedImages.length >= 3} // 총 이미지 개수 제한
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
                      <span className="ml-6">{imgUrls.length + uploadedImages.length}/3</span>
                      <span className="text-gray-400 text-sm ml-6">사진은 최대 2MB 이하의 JPG, PNG, GIF 파일 3장까지 첨부 가능합니다.</span>
                    </div>
                  </div>
                  <div className="flex mt-3">
                    {/* 기존 이미지들 먼저 보여주기 */}
                    {imgUrls && imgUrls.map((url, index) => (
                      <ImageWithDeleteButton
                        key={`existing-${index}`}
                        src={url}
                        alt={`Existing Image ${index + 1}`}
                        onDelete={() => handleDeleteExistingImage(index)}
                      />
                    ))}
                    {/* 새로 업로드된 이미지들 보여주기 */}
                    {uploadedImages.map((image, index) => (
                      <ImageWithDeleteButton
                        key={index}
                        src={URL.createObjectURL(image)}
                        alt={`Uploaded Image ${index + 1}`}
                        onDelete={() => handleDeleteUploadedImage(index)}
                      />
                    ))}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="w-1/4 text-lg text-center">메모</td>
                <td>
                  <textarea
                    className="w-full h-40 border border-gray-300 rounded-md p-2 focus:outline-none mt-3 mb-3"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
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
