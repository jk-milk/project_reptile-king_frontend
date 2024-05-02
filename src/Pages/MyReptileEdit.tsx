import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
      setName(location.state.name);
      if (location.state.birth === null)
        setBirth('');
      else
        setBirth(location.state.birth)
      setSpecies(location.state.species);
      setGender(location.state.gender);
      if (location.state.memo !== null)
        setMemo(location.state.memo);
      setImgUrls(location.state.img_urls || []);
    };
    fetchReptile();
  }, [location.state]);

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
    const confirmSubmit = confirm('파충류 수정을 완료하시겠습니까?');
    if (confirmSubmit) {
      const formData = new FormData();

      formData.append('name', name);
      formData.append('species', species);
      formData.append('gender', gender);
      formData.append('birth', birth);
      formData.append('memo', memo);
      formData.append('imgUrls', JSON.stringify(imgUrls));

      uploadedImages.forEach(image => {
        formData.append('images[]', image);
      });

      formData.append('_method', 'PATCH');

      try {
        const response = await apiWithAuth.post(`${API}reptiles/${id}`, formData);
        console.log(response);
        for (const pair of formData.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
        alert('파충류가 성공적으로 수정되었습니다.');
        navigate('/my-cage');
      } catch (error) {
        console.error(error);
        alert('파충류 수정에 실패했습니다.');
      }
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
        <div className="grid grid-cols-4 gap-4 mt-2">
          <div className="text-lg col-span-1 flex justify-center items-center">
            이름<span className="text-red-500 ml-1">*</span>
          </div>
          <input
            type="text"
            className="col-span-3 p-2 border border-gray-300 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          ></input>

          <div className="col-span-1 text-lg flex justify-center items-center">
            종
          </div>
          <input
            type="text"
            className="col-span-3 p-2 border border-gray-300 rounded"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
          ></input>

          <div className="col-span-1 text-lg flex justify-center items-center">
            생년월일
          </div>
          <input
            type="date"
            className="col-span-3 p-2 border border-gray-300 rounded"
            value={formatDate(birth)}
            onChange={(e) => setBirth(e.target.value)}
          ></input>

          <div className="text-lg col-span-1 flex justify-center items-center">
            성별<span className="text-red-500 ml-1">*</span>
          </div>
          <div className="col-span-3">
            <div className="flex">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="M"
                  checked={gender === 'M'}
                  onChange={(e) => setGender(e.target.value)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 mr-4 pb-0.5 text-gray-700">Male</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="F"
                  checked={gender === 'F'}
                  onChange={(e) => setGender(e.target.value)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 pb-0.5 text-gray-700">Female</span>
              </label>
            </div>
          </div>

          <div className="text-lg col-span-1 flex justify-center items-center">사진 첨부</div>
          <div className="col-span-3">
            <button
              className="hover:bg-blue-200 text-blue-500 border-2 border-blue-500 font-bold py-1 px-4 rounded transition duration-300"
              onClick={() => document.getElementById('imageUpload')?.click()}
              disabled={imgUrls.length + uploadedImages.length >= 3} // 총 이미지 개수 제한
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
            <span className="ml-6">{imgUrls.length + uploadedImages.length}/3</span>
            <span className="text-gray-400 text-sm ml-6">사진은 최대 2MB 이하의 JPG, PNG, GIF 파일 3장까지 첨부 가능합니다.</span>
          </div>
          {/* 기존 이미지들 먼저 보여주기 */}
          {imgUrls && imgUrls.map((url, index) => (
            <>
              <div className="col-span-1"></div>
              <div className="col-span-3 flex mt-3">
                <ImageWithDeleteButton
                  key={`existing-${index}`}
                  src={url}
                  alt={`Existing Image ${index + 1}`}
                  onDelete={() => handleDeleteExistingImage(index)}
                />
              </div>
            </>
          ))}
          {/* 새로 업로드된 이미지들 보여주기 */}
          {uploadedImages.map((image, index) => (
            <>
              <div className="col-span-1"></div>
              <div className="col-span-3 flex mt-3">
                <ImageWithDeleteButton
                  key={`uploaded-${index}`}
                  src={URL.createObjectURL(image)}
                  alt={`Uploaded Image ${index + 1}`}
                  onDelete={() => handleDeleteUploadedImage(index)}
                />
              </div>
            </>
          ))}

          <div className="text-lg col-span-1 flex justify-center items-center">메모</div>
          <textarea
            className="col-span-3 h-40 border border-gray-300 rounded-md p-2 focus:outline-none mt-3 mb-3"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="메모를 입력해 주세요..."
          ></textarea>
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
