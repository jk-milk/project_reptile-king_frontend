import { useState } from 'react';
import { apiWithAuth } from '../components/common/axios';
import { API } from '../config';
import { useNavigate } from 'react-router-dom';
import ImageWithDeleteButton from '../components/Board/ImageWithDeleteButton';

function MyReptileAdd() {
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [reptileName, setReptileName] = useState('');
  const [species, setSpecies] = useState('');
  const [gender, setGender] = useState('');
  const [birth, setBirth] = useState('');
  const [memo, setMemo] = useState('');

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

  const handleDeleteImage = (index: number) => {
    setUploadedImages((currentImages) => currentImages.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    const confirmSubmit = confirm('파충류 등록을 취소하시겠습니까?');
    if (confirmSubmit)
      navigate(-1);
  };

  const handleSubmit = async () => {
    if (!reptileName) {
      alert("이름을 입력해 주세요!")
      return;
    }
    if (!species) {
      alert("종을 입력해 주세요!")
      return;
    }
    if (!gender) {
      alert("성별을 선택해 주세요!")
      return;
    }

    const confirmSubmit = confirm('파충류 등록을 완료하시겠습니까?');

    if (confirmSubmit) {
      const formData = new FormData();
      formData.append('name', reptileName);
      formData.append('species', species);
      formData.append('gender', gender);
      formData.append('birth', birth);
      formData.append('memo', memo);
      uploadedImages.forEach(image => {
        formData.append('images[]', image);
      });

      try {
        await apiWithAuth.post(API + 'reptiles', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        alert('파충류가 성공적으로 등록되었습니다.');
        navigate(-1);
      } catch (error) {
        console.error(error);
        alert('파충류 등록에 실패했습니다.');
      }
    }
  };

  return (
    <div className="pt-10 pb-10 mx-auto max-w-screen-lg">
      <div className="bg-white rounded-lg shadow-md px-5 py-4">
        <div className="font-bold text-3xl mb-3">파충류 등록</div>
        <div className="grid grid-cols-4 gap-4 mt-2">
          <div className="text-lg col-span-1 flex justify-center items-center">
            이름<span className="text-red-500 ml-1">*</span>
          </div>
          <input
            type="text"
            className="col-span-3 p-2 border border-gray-300 rounded"
            placeholder="파충류 이름을 입력해 주세요..."
            onChange={(e) => setReptileName(e.target.value)}
          />

          <div className="text-lg col-span-1 flex justify-center items-center">
            종<span className="text-red-500 ml-1">*</span>
          </div>
          <input
            type="text"
            className="col-span-3 p-2 border border-gray-300 rounded"
            placeholder="파충류 종류를 입력해 주세요..."
            onChange={(e) => setSpecies(e.target.value)}
          ></input>

          <div className="text-lg col-span-1 flex justify-center items-center">생년월일</div>
          <input
            type="date"
            value={birth}
            className="w-40 col-span-3 p-2 border border-gray-300 rounded"
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
          </div>

          {uploadedImages.length > 0 && (
            <>
              <div className="col-span-1"></div>
              <div className="col-span-3 flex mt-3">
                {uploadedImages.map((image, index) => (
                  <ImageWithDeleteButton
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`Uploaded Image ${index + 1}`}
                    onDelete={() => handleDeleteImage(index)}
                  />
                ))}
              </div>
            </>
          )}

          <div className="text-lg col-span-1 flex justify-center items-center">메모</div>
          <textarea
            className="col-span-3 h-40 border border-gray-300 rounded-md p-2 focus:outline-none mt-3 mb-3"
            placeholder="메모를 입력해 주세요..."
            onChange={(e) => setMemo(e.target.value)}
          ></textarea>
        </div>
        <div className="flex justify-center mt-3">
          <button
            className="hover:bg-red-200 text-red-500 border-red-500 border-2 font-bold py-1 px-4 rounded mr-6 self-center transition duration-300"
            onClick={handleCancel}
          >
            취소
          </button>
          <button
            className="hover:bg-blue-200 border-blue-500 border-2 text-blue-500 font-bold py-1 px-4 rounded self-center transition duration-300"
            onClick={handleSubmit}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyReptileAdd;
