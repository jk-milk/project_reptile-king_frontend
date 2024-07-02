import { useEffect, useState } from 'react';
import { apiWithAuth } from '../components/common/axios';
import { API } from '../config';
import { Reptile } from '../types/Cage';
import { useNavigate } from 'react-router-dom';
import ImageWithDeleteButton from '../components/Board/ImageWithDeleteButton';

function MyCageAdd() {
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [cageName, setCageName] = useState('');
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
        if (response.status === 204) {
          setReptiles([]);
        } else {
          setReptiles(response.data.reptiles);
        }
      } catch {
        console.error("서버 오류");
        alert("サーバーエラー！しばらくしてから再試行してください。");
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
        if (extension && !['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
          alert('JPG、PNG、GIF、WEBP、SVGファイルのみアップロードできます。');
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
    const confirmCancel = confirm('飼育ケージ登録をキャンセルしますか？');
    if (confirmCancel)
      navigate('/my-cage');
  };

  const handleSubmit = async () => {
    if (!cageName) {
      alert("名前を入力してください！")
      return;
    }
    if (!serialCode) {
      alert("シリアルコードを入力してください！")
      return;
    }

    const confirmSubmit = confirm('飼育ケージ登録を完了しますか？');
    console.log(uploadedImages);

    if (confirmSubmit) {
      const formData = new FormData();
      console.log(reptileSerialCode, typeof (reptileSerialCode));

      formData.append('name', cageName);
      formData.append('setTemp', '30');
      formData.append('setHum', '40');
      formData.append('serialCode', serialCode);
      formData.append('reptileSerialCode', reptileSerialCode);

      uploadedImages.forEach(image => {
        formData.append('images[]', image);
      });

      try {
        const response = await apiWithAuth.post(API + 'cages', formData);
        console.log(response);

        for (const pair of response.config.data.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`);
        }

        alert('飼育ケージの登録に成功しました。');
        navigate('/my-cage');
      } catch (error) {
        console.error(error);
        alert('飼育場登録に失敗しました。 しばらくしてからもう一度お試しください。');
      }
    }
  };

  return (
    <div>
      <div className="pt-10 pb-10 mx-auto max-w-screen-lg">
        <div className="bg-white rounded-lg shadow-md px-5 py-4">
          <div className="font-bold text-3xl mb-3">飼育ケージ登録</div>
          <div className="grid grid-cols-4 gap-4 mt-2">
            <div className="text-lg col-span-1 flex justify-center items-center">
              名前 <span className="text-red-500 ml-1">*</span>
            </div>
            <input
              type="text"
              className="col-span-3 p-2 border border-gray-300 rounded"
              placeholder="名前を入力してください..."
              onChange={(e) => setCageName(e.target.value)}
              required
            />

            <div className="col-span-1 text-lg flex justify-center items-center">
              爬虫類選択
            </div>
            <div className="col-span-3">

              {reptiles === null ? (
                // 로딩 중인 경우
                <p className="w-fit h-10 p-2 border border-gray-300 rounded mb-2 text-center">ロード中...</p>
              ) : reptiles.length === 0 ? (
                // 데이터가 없는 경우
                <div className='flex h-10 mb-2'>
                  <div className="w-fit p-2 border border-gray-300 rounded text-center">
                    <p>登録された爬虫類がありません。</p>
                  </div>
                  <button
                    onClick={() => navigate('/my-cage/reptile/add')}
                    className="ms-2 hover:bg-blue-200 text-blue-500 border-2 border-blue-500 font-bold py-1 px-4 rounded"
                  >
                    爬虫類を追加する
                  </button>
                </div>
              ) : (
                // 데이터가 있는 경우, select와 options를 표시
                <div className='flex h-10 mb-2'>
                  <select
                    value={reptileSerialCode}
                    onChange={(event) => {
                      setReptileSerialCode(event.target.value);
                      console.log(event.target.value); // 선택된 값 출력
                    }}
                    className="w-1/6 h-10 p-2 border border-gray-300 rounded mb-2">
                    <option value="" disabled>選択</option>
                    {reptiles.map((reptile) => (
                      <option key={reptile.id} value={reptile.serial_code}>{reptile.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => navigate('/my-cage/reptile/add')}
                    className="ms-2 hover:bg-blue-200 text-blue-500 border-2 border-blue-500 font-bold py-1 px-4 rounded transition duration-300"
                  >
                    爬虫類を追加する
                  </button>
                </div>
              )}
            </div>

            <div className="col-span-1 flex justify-center items-center text-lg">写真添付</div>
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

            <div className="text-lg col-span-1 flex justify-center items-center">
              シリアルコード<span className="text-red-500 ml-1">*</span>
            </div>
            <input
              type="text"
              className="col-span-3 p-2 border border-gray-300 rounded"
              placeholder="シリアルコードを入力してください..."
              value={serialCode}
              onChange={(e) => setSerialCode(e.target.value)}
            />
          </div>

          <div className="flex justify-center mt-5">
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
    </div>
  );
}

export default MyCageAdd;
