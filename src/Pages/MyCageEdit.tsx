import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiWithAuth } from '../components/common/axios';
import { API } from '../config';
import { Cage, Reptile } from '../types/Cage';
import ImageWithDeleteButton from '../components/Board/ImageWithDeleteButton';

function MyCageEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state.id;

  useEffect(() => {
    const fetchCage = async () => {
      setCage(location.state);
      setName(location.state.name);
      if (location.state.reptile_serial_code === null)
        setReptileSerialCode("none");
      else
        setReptileSerialCode(location.state.reptile_serial_code);
      setSerialCode(location.state.serial_code);
      if (location.state.memo !== null)
        setMemo(location.state.memo);
      setImgUrls(location.state.img_urls || []);
    };
    fetchCage();

  }, [location.state]);

  const [cage, setCage] = useState<Cage>();
  console.log(cage);

  const [name, setName] = useState('');
  const [reptileSerialCode, setReptileSerialCode] = useState('');
  const [serialCode, setSerialCode] = useState('');
  const [memo, setMemo] = useState('');
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [reptiles, setReptiles] = useState<Reptile[] | null>(null);
  console.log(reptiles);  


  // 사용자의 파충류 목록 가져오기
  useEffect(() => {
    const fetchReptiles = async () => {
      try {
        const response = await apiWithAuth.get(API + "reptiles");
        if (response.status === 204) {
          setReptiles([]);
        } else {
          setReptiles(response.data.reptiles);
        }
      } catch {
        console.error("서버 오류");
        alert("서버 오류! 잠시 후 다시 시도해 주세요.");
      }
    };

    fetchReptiles();
  }, []);

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
    const confirmCancel = confirm('사육장 수정을 취소하시겠습니까?');
    if (confirmCancel)
      navigate(-1);
  };

  const handleSubmit = async () => {
    const confirmSubmit = confirm('사육장 수정을 완료하시겠습니까?');

    if (confirmSubmit && cage) {
      const formData = new FormData();

      let editReptileSerialCode = ''
      if (cage.reptile_serial_code !== null)
        editReptileSerialCode = cage.reptile_serial_code

      formData.append('name', name);
      formData.append('serialCode', cage.serial_code);
      formData.append('memo', memo);
      formData.append('reptileSerialCode', editReptileSerialCode);
      formData.append('imgUrls', JSON.stringify(imgUrls));

      // 새로운 이미지 파일들을 FormData에 추가
      uploadedImages.forEach(image => {
        formData.append('images[]', image);
      });

      formData.append('_method', 'PATCH');

      // FormData의 모든 key-value 쌍을 로그로 확인
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      try {
        const response = await apiWithAuth.post(`${API}cages/${id}`, formData);

        console.log(response);

        for (const pair of response.config.data.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`);
        }

        alert('사육장이 성공적으로 수정되었습니다.');
        navigate('/my-cage');
      } catch (error) {
        console.error(error);
        alert('사육장 수정에 실패했습니다.');
      }
    }
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
        <div className="font-bold text-3xl mb-3">사육장 수정</div>
        <div className="grid grid-cols-4 gap-4 mt-2">
          <div className="text-lg col-span-1 flex justify-center items-center">
            이름<span className="text-red-500 ml-1">*</span>
          </div>
          <input
            type="text"
            className="col-span-3 p-2 border border-gray-300 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>

          <div className="col-span-1 text-lg flex justify-center items-center">
            파충류 선택
          </div>
          <div className="col-span-3">
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="reptileSerialCode"
                  value="none"
                  checked={reptileSerialCode === 'none'}
                  onChange={(e) => setReptileSerialCode(e.target.value)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 mr-4 pb-0.5 text-gray-700">미등록</span>
              </label>
              {reptiles === null ? (
                // 로딩 중인 경우
                <p className="w-fit h-10 p-1 border border-gray-300 rounded mb-2 text-center">로딩 중...</p>
              ) : reptiles.length === 0 ? (
                // 데이터가 없는 경우
                <div className='flex h-10 mb-1'>
                  <div className="w-fit p-2 border border-gray-300 rounded text-center">
                    <p>등록된 파충류가 없습니다.</p>
                  </div>
                  <button
                    onClick={() => navigate('/my-cage/reptile/add')}
                    className="ms-2 hover:bg-blue-200 text-blue-500 border-2 border-blue-500 font-bold py-1 px-4 rounded"
                  >
                    파충류 추가하기
                  </button>
                </div>
              ) : (
                // 데이터가 있는 경우, select와 options를 표시
                <div className='flex h-10 mb-1'>
                  <select
                    value={reptileSerialCode}
                    onChange={(event) => {
                      setReptileSerialCode(event.target.value);
                      console.log(event.target.value); // 선택된 값 출력
                    }}
                    className="h-10 p-2 border border-gray-300 rounded mb-2">
                    <option value="none" disabled>파충류 선택</option>
                    {reptiles.map((reptile) => (
                      <option key={reptile.id} value={reptile.serial_code}>{reptile.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => navigate('/my-cage/reptile/add')}
                    className="ms-2 hover:bg-blue-200 text-blue-500 border-2 border-blue-500 font-bold py-1 px-4 rounded transition duration-300"
                  >
                    파충류 추가하기
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-1 flex justify-center items-center text-lg">사진 첨부</div>
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

          <div className="text-lg col-span-1 flex justify-center items-center">
            시리얼 코드<span className="text-red-500 ml-1">*</span>
          </div>
          <input
            type="text"
            className="col-span-3 p-2 border border-gray-300 rounded"
            placeholder="시리얼 코드를 입력해 주세요..."
            value={serialCode}
            onChange={(e) => setSerialCode(e.target.value)}
          />

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

export default MyCageEdit;
