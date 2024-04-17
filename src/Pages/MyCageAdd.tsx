import { useEffect, useState } from 'react';
import { apiWithAuth } from '../components/common/axios';
import { API } from '../config';
import { Reptile } from '../types/Cage';
import { useNavigate } from 'react-router-dom';

function MyCageAdd() {
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [cageName, setCageName] = useState('');
  const [memo, setMemo] = useState('');
  const [temp, setTemp] = useState<number>(20);
  const [hum, setHum] = useState<number>(20);
  const [serialCode, setSerialCode] = useState('');
  const [reptiles, setReptiles] = useState<Reptile[] | null>(null);
  const [reptileSerialCode, setReptileSerialCode] = useState('');

  // 사용자의 파충류 목록 가져오기
  useEffect(() => {
    const fetchReptiles = async () => {
      try {
        const response = await apiWithAuth.get(API + "reptiles");
        // console.log(response);
        // setCategories(postsCategories);
        if (response.data.msg === "데이터 없음") {
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
    const confirmCancel = window.confirm('사육장 등록을 취소하시겠습니까?');
    if (confirmCancel)
      navigate('/my-cage');
  };

  const handleSubmit = async () => {
    const confirmSubmit = window.confirm('사육장 등록을 완료하시겠습니까?');
    console.log(uploadedImages);

    if (confirmSubmit) {
      const formData = new FormData();
      formData.append('name', cageName);
      formData.append('setTemp', temp.toString());
      formData.append('setHum', hum.toString());
      formData.append('serialCode', serialCode);
      formData.append('memo', memo);
      formData.append('reptileSerialCode', reptileSerialCode);

      uploadedImages.forEach(image => {
        formData.append('images[]', image);
      });

      try {
        const response = await apiWithAuth.post(API + 'cages', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response);

        alert('사육장이 성공적으로 등록되었습니다.');
        navigate('/my-cage');
      } catch (error) {
        console.error(error);
        alert('사육장 등록에 실패했습니다.');
      }
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
                      onChange={(e) => setCageName(e.target.value)}
                    ></input>
                  </td>
                </tr>
                <tr>
                  <td className="w-1/4 text-lg text-center">
                    파충류 선택
                  </td>
                  <td>
                    {reptiles === null ? (
                      // 로딩 중인 경우
                      <p className="w-fit h-10 p-2 border border-gray-300 rounded mb-2 text-center">로딩 중...</p>
                    ) : reptiles.length === 0 ? (
                      // 데이터가 없는 경우
                      <div className='flex h-10 mb-2'>
                        <div className="w-fit p-2 border border-gray-300 rounded text-center">
                          <p>등록된 파충류가 없습니다.</p>
                        </div>
                        <button
                          onClick={() => navigate('/my-cage/reptile/add')}
                          className="ms-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                        >
                          파충류 추가하기
                        </button>
                      </div>
                    ) : (
                      // 데이터가 있는 경우, select와 options를 표시
                      <select
                        value={reptileSerialCode}
                        onChange={(event) => {
                          setReptileSerialCode(event.target.value);
                          console.log(event.target.value); // 선택된 값 출력
                        }}
                        className="w-1/6 h-10 p-2 border border-gray-300 rounded mb-2">
                        <option value="" disabled>파충류 선택</option>
                        {reptiles.map((reptile) => (
                          <option key={reptile.name} value={reptile.serial_code}>{reptile.name}</option>
                        ))}
                      </select>
                    )}
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
                    <span className="text-gray-400 text-sm ml-6">사진은 최대 2MB 이하의 JPG, PNG, GIF 파일 3장까지 첨부 가능합니다.</span>
                  </td>
                </tr>
                <tr>
                  <td className="w-1/4 text-lg text-center">
                    설정 온도
                  </td>
                  <td>
                    <input
                      type="number"
                      className="w-full h-10 p-2 border border-gray-300 rounded mt-2 mb-2"
                      placeholder="온도를 입력해 주세요..."
                      value={temp}
                      onChange={(e) => setTemp(Number(e.target.value))}
                    ></input>
                  </td>
                </tr>
                <tr>
                  <td className="w-1/4 text-lg text-center">
                    설정 습도
                  </td>
                  <td>
                    <input
                      type="text"
                      className="w-full h-10 p-2 border border-gray-300 rounded mt-2 mb-2"
                      placeholder="습도를 입력해 주세요..."
                      value={hum}
                      onChange={(e) => setHum(Number(e.target.value))}
                    ></input>
                  </td>
                </tr>
                <tr>
                  <td className="w-1/4 text-lg text-center">
                    시리얼 코드
                  </td>
                  <td>
                    <input
                      type="text"
                      className="w-full h-10 p-2 border border-gray-300 rounded mt-2 mb-2"
                      placeholder="시리얼 코드를 입력해 주세요..."
                      value={serialCode}
                      onChange={(e) => setSerialCode(e.target.value)}
                    ></input>
                  </td>
                </tr>
                <tr>
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
                      onChange={(e) => setMemo(e.target.value)}
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
