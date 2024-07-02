import { useState } from 'react';
import { apiWithAuth } from '../components/common/axios';
import { API } from '../config';
import { useLocation, useNavigate } from 'react-router-dom';
import ImageWithDeleteButton from '../components/Board/ImageWithDeleteButton';

function MyReptileAdd() {
  const navigate = useNavigate();
  const location = useLocation();
  const cage = location.state;
  console.log(cage);
  
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [reptileName, setReptileName] = useState('');
  const [species, setSpecies] = useState('');
  const [gender, setGender] = useState('');
  const [birth, setBirth] = useState('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (extension && !['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
          alert('JPG、PNG、GIFファイルのみアップロードできます。');
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
    const confirmSubmit = confirm('爬虫類の登録をキャンセルしますか？');
    if (confirmSubmit)
      navigate(-1);
  };

  const handleSubmit = async () => {
    if (!reptileName) {
      alert("名前を入力してください！")
      return;
    }
    if (!species) {
      alert("種類を入力してください！")
      return;
    }
    if (!gender) {
      alert("性別を選択してください！")
      return;
    }

    const confirmSubmit = confirm('爬虫類登録を完了しますか？');

    if (confirmSubmit) {
      const formData = new FormData();
      formData.append('name', reptileName);
      formData.append('species', species);
      formData.append('gender', gender);
      formData.append('birth', birth);
      uploadedImages.forEach(image => {
        formData.append('images[]', image);
      });

      try {
        const response = await apiWithAuth.post(API + 'reptiles', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response);

        alert('爬虫類の登録に成功しました。');
        if (cage) {
          const cageFormData = new FormData();

          cageFormData.append('name', cage.name);
          cageFormData.append('serialCode', cage.serial_code);
          cageFormData.append('reptileSerialCode', response.data.reptile_serial_code);
          cageFormData.append('imgUrls', JSON.stringify(cage.img_urls));
          cageFormData.append('_method', 'PATCH');

          try {
            const cageResponse = await apiWithAuth.post(`${API}cages/${cage.id}`, cageFormData);
            console.log(cageResponse);
          } catch (error) {
            console.error(error);
            alert('飼育ケージへの爬虫類登録に失敗')
          }
        }
        navigate(-1);
      } catch (error) {
        console.error(error);
        alert('爬虫類の登録に失敗しました。');
      }
    }
  };

  return (
    <div className="pt-10 pb-10 mx-auto max-w-screen-lg">
      <div className="bg-white rounded-lg shadow-md px-5 py-4">
        <div className="font-bold text-3xl mb-3">爬虫類登録</div>
        <div className="grid grid-cols-4 gap-4 mt-2">
          <div className="text-lg col-span-1 flex justify-center items-center">
            名前<span className="text-red-500 ml-1">*</span>
          </div>
          <input
            type="text"
            className="col-span-3 p-2 border border-gray-300 rounded"
            placeholder="爬虫類の名前を入力してください..."
            onChange={(e) => setReptileName(e.target.value)}
          />

          <div className="text-lg col-span-1 flex justify-center items-center">
            種類<span className="text-red-500 ml-1">*</span>
          </div>
          <input
            type="text"
            className="col-span-3 p-2 border border-gray-300 rounded"
            placeholder="爬虫類の種類を入力してください..."
            onChange={(e) => setSpecies(e.target.value)}
          ></input>

          <div className="text-lg col-span-1 flex justify-center items-center">生年月日</div>
          <input
            type="date"
            value={birth}
            className="w-40 col-span-3 p-2 border border-gray-300 rounded"
            onChange={(e) => setBirth(e.target.value)}
          ></input>

          <div className="text-lg col-span-1 flex justify-center items-center">
            性別<span className="text-red-500 ml-1">*</span>
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

          <div className="text-lg col-span-1 flex justify-center items-center">写真添付</div>
          <div className="col-span-3">
            <button
              className="hover:bg-blue-200 text-blue-500 border-2 border-blue-500 font-bold py-1 px-4 rounded transition duration-300"
              onClick={() => document.getElementById('imageUpload')?.click()}
              disabled={uploadedImages.length >= 3}
            >
              写真を貼る
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
            <span className="text-gray-400 text-sm ml-6">写真は最大2MB以下のJPG、PNG、GIFファイルを3枚まで添付できます。</span>
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
        </div>
        <div className="flex justify-center mt-3">
          <button
            className="hover:bg-red-200 text-red-500 border-red-500 border-2 font-bold py-1 px-4 rounded mr-6 self-center transition duration-300"
            onClick={handleCancel}
          >
            キャンセル
          </button>
          <button
            className="hover:bg-blue-200 border-blue-500 border-2 text-blue-500 font-bold py-1 px-4 rounded self-center transition duration-300"
            onClick={handleSubmit}
          >
            登録
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyReptileAdd;
