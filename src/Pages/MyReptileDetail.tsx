import { useEffect, useState } from 'react';
import { apiWithAuth } from '../components/common/axios';
import { API } from '../config';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Reptile } from '../types/Cage';
import { calculateAge } from '../utils/CalculateAge';
import { FaCamera } from 'react-icons/fa6';
import { Autoplay, Pagination, Navigation as SwiperNavigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ImageWithDeleteButton from '../components/Board/ImageWithDeleteButton';

function MyReptileDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();  
  const reptileSerialCode = location.state.reptileSerialCode;

  const [reptile, setReptile] = useState<Reptile>();
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isEdited, setIsEdited] = useState(false);



  // 파충류 상세 데이터 가져오기
  useEffect(() => {
    const fetchReptile = async () => {
      const response = await apiWithAuth.get(API + "reptiles/" + reptileSerialCode);
      console.log(response);
      setReptile(response.data.reptile);
    };
    fetchReptile();
  }, [reptileSerialCode]);

  // // 파충류 상세 데이터 가져오기
  // useEffect(() => {
  //   const fetchCage = async () => {
  //     console.log(location.state.reptile);
  //     setReptile(location.state.reptile);
  //   };
  //   fetchCage();
  // }, [location.state]);
  // console.log(reptile);

  const handleEdit = () => {
    navigate(`/my-cage/reptile/edit/${id}`, {
      state: reptile
    });
  }

  const handleDelete = async () => {
    const check = confirm("정말 삭제하시겠습니까?");
    if (check) {
      try {
        const response = await apiWithAuth.delete(API + "reptiles/" + id);
        console.log(response);
        alert("삭제되었습니다.")
        navigate("/my-cage");
      } catch (error) {
        console.error(error);
        alert("파충류 삭제 중 에러! 다시 시도해 주세요!")
      }
    }
  }

  const toggleUploadPanel = () => {
    setShowUploadPanel(!showUploadPanel);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      // 새로 업로드할 수 있는 이미지 개수를 계산 (최대 3개 - 기존 이미지 개수)
      const availableSlots = 3 - reptile!.img_urls.length;
      const filesToAdd = filesArray.slice(0, availableSlots);
      setUploadedImages([...uploadedImages, ...filesToAdd]);
      setIsEdited(true);
    }
  };

  // 기존 이미지 삭제
  const handleDeleteExistingImage = (indexToDelete: number) => {
    setReptile((prevReptile) => {
      // 새로운 img_urls 배열을 생성합니다. 특정 인덱스의 항목을 제외하고 모든 항목을 포함합니다.
      const newImgUrls = prevReptile?.img_urls.filter((_, index) => index !== indexToDelete);
      setIsEdited(true);

      // 새로운 img_urls 배열을 포함하는 새로운 cage 상태 객체를 반환합니다.
      return {...prevReptile, img_urls: newImgUrls};
    });
  };

  // 새로 업로드된 이미지 삭제
  const handleDeleteUploadedImage = (indexToDelete: number) => {
    setUploadedImages((prev) => prev.filter((_, index) => index !== indexToDelete));
  };

  const handleSaveChanges = async () => {
    const confirmSubmit = confirm('파충류 수정을 완료하시겠습니까?');
    if (confirmSubmit) {
      const formData = new FormData();

      formData.append('name', reptile!.name);
      formData.append('species', reptile!.species);
      formData.append('gender', reptile!.gender);
      formData.append('birth', reptile!.birth);
      formData.append('imgUrls', JSON.stringify(reptile?.img_urls));

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

  return (
    <>
      {reptile ? (
        <div className="pt-10 pb-10 mx-auto max-w-screen-lg">
          <div className="bg-white rounded-lg shadow-md px-5 py-4">
            <div className="font-bold text-3xl mb-4 text-gray-800">파충류 세부정보</div>

            <div className="flex mb-12 items-start">
              <div className="w-1/2 pr-6 relative">
                <Swiper
                  centeredSlides={true}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                  }}
                  navigation={false}
                  modules={[Autoplay, Pagination, SwiperNavigation]}
                  className="mySwiper"
                >
                  {reptile?.img_urls.length !== 0 ? (
                    reptile?.img_urls.map((url, index) => (
                      <SwiperSlide key={index}>
                        <img src={url} alt={`Slide ${index + 1}`} className="w-full h-auto object-cover rounded-lg" />
                      </SwiperSlide>
                    ))
                  ) : (
                    <SwiperSlide>
                      <img
                        src='https://capstone-project-pachungking.s3.ap-northeast-2.amazonaws.com/images/defaults/defaultReptileImage2.jpg' // 이미지가 없을 경우 디폴트 이미지 추가

                        alt='파충류 기본 이미지'
                        className="w-full h-auto object-contain object-top rounded-lg"
                      />
                    </SwiperSlide>
                  )}
                </Swiper>
                <div className="absolute right-6 bottom-0 p-2 z-10">
                  <label htmlFor="file-upload"
                    className="cursor-pointer text-4xl bg-white rounded-full p-3 shadow-lg inline-block"
                    onClick={toggleUploadPanel}>
                    <FaCamera />
                  </label>
                </div>
              </div>

              <div className="w-1/2">
                <div className="flex items-center mb-3">
                  <div className="font-bold text-2xl">파충류 정보</div>
                </div>
                <hr className="border-t border-gray-400 mb-2" />
                <div className="w-full mb-6">
                  <div className="flex">
                    <div className="font-semibold text-xl w-1/6">이름</div>
                    <div className="text-lg">{reptile?.name ? reptile.name : "미등록"}</div>
                  </div>
                  <div className="flex">
                    <div className="font-semibold text-xl w-1/6">종</div>
                    <div className="text-lg">{reptile?.species ? reptile.species : "미등록"}</div>
                  </div>
                  <div className="flex">
                    <div className="font-semibold text-xl w-1/6">나이</div>
                    <div className="text-lg">{calculateAge(reptile?.birth)}</div>
                  </div>
                </div>
              </div>

            </div>

            {showUploadPanel && (
              <div className="bg-white rounded-lg shadow-lg p-5 max-w-full mx-12 mb-12">
                <div className="grid grid-cols-4 gap-4 mt-2">
                  <div className="col-span-1 flex justify-center items-center text-2xl font-semibold">사진 첨부</div>
                  <div className="col-span-3">
                    <button
                      className="hover:bg-blue-200 text-blue-500 border-2 border-blue-500 font-bold py-1 px-4 rounded transition duration-300 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-500"
                      onClick={() => document.getElementById('imageUpload')?.click()}
                      disabled={reptile.img_urls.length + uploadedImages.length >= 3}
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
                    <span className="ml-6">{reptile.img_urls.length + uploadedImages.length}/3</span>
                    <span className="text-gray-400 text-sm ml-6">사진은 최대 2MB 이하의 JPG, PNG, GIF 파일 3장까지 첨부 가능합니다.</span>
                  </div>
                  <div className="col-span-4 mt-4 flex overflow-x-auto ml-20">
                    {reptile.img_urls.map((url, index) => (
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
                  </div>
                </div>
              </div>
            )}

            <div className="font-bold text-3xl mb-3">건강분석</div>
            <hr className="border-t border-gray-400 mb-3" />
            <div className="bg-gray-300 rounded-md flex justify-center items-center">
              {/* 활동량, 탈피주기 확인 차트 */}
              <img
                src="https://img.freepik.com/free-vector/flat-design-dynamic-veterinary-clinic-infographic_23-2149680939.jpg?t=st=1713955901~exp=1713959501~hmac=42ee9f09ccbdafe5b1fd6c05d86a55899d1bdc2022bb0b057695f7d83bfbdeb4&w=996"
                alt="활동량, 탈피주기 확인 차트"
                className='w-full'
              />
            </div>

            <div className="flex justify-center">
              <Link to="/my-cage" className="border-blue-500 border-2 hover:bg-blue-200 text-blue-500 font-semibold py-2 px-4 rounded mt-16 transition duration-300">목록으로 돌아가기</Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          로딩 중
        </>
      )}
    </>
  );
}

export default MyReptileDetail;
