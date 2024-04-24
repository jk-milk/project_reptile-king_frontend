import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiWithAuth } from '../components/common/axios';
import { API } from '../config';
import { Cage } from '../types/Cage';
import axios from 'axios';
import ImageWithDeleteButton from '../components/Board/ImageWithDeleteButton';

function MyCageEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  // console.log(location.state);
  const id = location.state.id;
  // console.log(location.state.img_urls);

  useEffect(() => {
    const fetchCage = async () => {
      setCage(location.state);
      setName(location.state.name);
      if (location.state.memo !== null)
        setMemo(location.state.memo);
      setImgUrls(location.state.img_urls || []);
    };
    fetchCage();

  }, [location.state]);

  const [cage, setCage] = useState<Cage>();
  const [name, setName] = useState('');
  const [memo, setMemo] = useState('');
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  // const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files;
  //   if (files) {
  //     const images = Array.from(files).slice(0, 3 - uploadedImages.length);
  //     setUploadedImages(prevImages => [...prevImages, ...images]);
  //     images.forEach(image => {
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         const uploadedImageURL = reader.result as string;
  //         setCageImage(uploadedImageURL);
  //       };
  //       reader.readAsDataURL(image);
  //     });
  //   }
  // };

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
      navigate('/my-cage');
  };

  const handleSubmit = async () => {
    const confirmSubmit = confirm('사육장 수정을 완료하시겠습니까?');
    // console.log(uploadedImages);
    // const stringImgUrls = JSON.stringify(imgUrls);
    // console.log(stringImgUrls);


    if (confirmSubmit && cage) {
      const formData = new FormData();

      let editReptileSerialCode = ''
      if (cage.reptile_serial_code !== null)
        editReptileSerialCode = cage.reptile_serial_code

      formData.append('name', name);
      formData.append('serialCode', cage.serial_code);
      formData.append('memo', memo);
      formData.append('reptileSerialCode', editReptileSerialCode);
      // formData.append('imgUrls', JSON.stringify(imgUrls));

      if (imgUrls.length === 0)
        formData.append('imgUrls[]', '');
      else {
        imgUrls.forEach(url => {
          formData.append('imgUrls[]', url);
        });
      }

      // const editData = {
      //   name,
      //   serialCode: cage.serial_code,
      //   memo,
      //   reptileSerialCode: cage.reptile_serial_code!,
      //   imgUrls: imgUrls
      // }
      // console.log(JSON.stringify(editData));
      // const jsonEditData = JSON.stringify(editData);
      // const blobJsonEditData = new Blob([jsonEditData], { type: 'application/json' });
      // formData.append('editData', blobJsonEditData);

      // formData.append('editData', blobJsonEditData);

      // 새로운 이미지 파일들을 FormData에 추가
      uploadedImages.forEach(image => {
        formData.append('images[]', image);
      });

      formData.append('_method', 'PATCH');

      // FormData의 모든 key-value 쌍을 로그로 확인
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
      // console.log(id);
      const token = localStorage.getItem('token');

      try {
        // const response = await apiWithAuth.patch(`${API}cages/${id}`, formData, {
        //   headers: {
        //     // 'Content-Type': 'application/json',
        //     'Content-Type': 'multipart/form-data',
        //   },
        // });
        const response = await axios({
          method: 'post',
          url: `${API}cages/${id}`,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': token
          }
        });

        console.log(response);

        for (let pair of response.config.data.entries()) {
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
                <td className="w-1/4 text-lg text-center">이미지</td>
                <td>
                  <div className="flex items-center">
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
                        key={`uploaded-${index}`}
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

export default MyCageEdit;
