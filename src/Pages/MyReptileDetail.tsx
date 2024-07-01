import { useEffect, useState } from 'react';
import { apiWithAuth } from '../components/common/axios';
import { API } from '../config';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Reptile } from '../types/Cage';
import { calculateAge } from '../utils/CalculateAge';
import { FaCamera } from 'react-icons/fa6';
import { Autoplay, Pagination, Navigation as SwiperNavigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ImageWithDeleteButton from '../components/Board/ImageWithDeleteButton';
import { MdCreate } from 'react-icons/md';
import ActivityChart from '../components/Cage/ActivityChart';

function MyReptileDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const reptileSerialCode = location.state.reptileSerialCode;

  const [reptile, setReptile] = useState<Reptile>();
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isEdited, setIsEdited] = useState(false);
  console.log(reptile);

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
      return { ...prevReptile, img_urls: newImgUrls };
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

      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

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

  // 이름만 업데이트
  const updateName = (newName: string) => {
    setReptile(prevState => ({
      ...prevState, // 기존 상태를 복사
      name: newName, // 변경할 값 업데이트
    }) as Reptile);
    setIsEdited(true);
  };

  // 생년월일만 업데이트
  const updateBirth = (newBirth: string) => {
    setReptile(prevState => ({
      ...prevState, // 기존 상태를 복사
      birth: newBirth, // 변경할 값 업데이트
    }) as Reptile);
    setIsEdited(true);
  };

  console.log(reptile?.birth, typeof (reptile?.birth));


  const formatDate = (dateString: string): string => {
    if (dateString === null) {
      console.log("?");
    }
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

  const [isUserSelectModalOpen, setUserSelectModalOpen] = useState(false); // 사용자 검색 모달창
  const [isAdoptModalOpen, setIsAdoptModalOpen] = useState(false); // 분양 정보 확인 모달창
  const [isChecked, setIsChecked] = useState(false); // 분양 정보 보내기에 체크 버튼
  const [selectedUser, setSelectedUser] = useState(''); // 선택된 유저 닉네임
  const [searchQuery, setSearchQuery] = useState(''); // 유저 닉네임 검색창의 검색어
  const [filteredUsers, setFilteredUsers] = useState<string[]>([]); // 검색된 유저들의 목록
  const [error, setError] = useState(''); // 유저가 검색되지 않았을 경우 나타낼 텍스트

  const toggleAdoptModal = () => {
    setIsAdoptModalOpen(!isAdoptModalOpen);
  };

  const toggleUserSelectModal = () => {
    setUserSelectModalOpen(!isUserSelectModalOpen);
  };

  const handleCheckboxChange = (event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
    setIsChecked(event.target.checked);
  };

  const handleUserSelect = (user: string) => {
    setSelectedUser(user);
    toggleUserSelectModal();
    toggleAdoptModal();
  };

  const handleSearch = async () => {
    try {
      console.log(searchQuery);

      // const response = await apiWithAuth.get(`users/${searchQuery}/info`);
      // console.log(response);

      // setFilteredUsers([response.data]);
      setFilteredUsers(["배석민"]);
      setError('');
    } catch (error) {
      setFilteredUsers([]);
      setError('검색 결과가 없습니다.');
    }
  };

  // 분양 정보 서버에 전송
  const sendAdoptionInfo = async () => {
    try {
      await apiWithAuth.post('/reptiles/sell-reptile', {
        receiveNickname: selectedUser,
        publicStatus: isChecked,
        reptileId: reptile?.id,
      });
      console.log(selectedUser, isChecked, reptile?.id);
      alert('분양 대상자에게 알림을 보냈습니다.');
      toggleAdoptModal();
    } catch (err) {
      alert('분양 정보를 전송하는 데 실패했습니다.');
    }
  };

  // 목록으로 돌아가기
  const handleNavigation = () => {
    if (isEdited) {
      const confirmLeave = confirm("변경 사항을 저장하지 않고 나가시겠습니까?");
      if (confirmLeave) {
        // 확인 - 이동
        navigate("/my-cage");
      }
      // 취소 - 그대로
    } else {
      // 변경x - 이동
      navigate("/my-cage");
    }
  };

  return (
    <>
      {reptile ? (
        <div className="pt-10 pb-10 mx-auto max-w-screen-lg">
          <div className="bg-white rounded-lg shadow-md px-5 py-4">
            {/* <div className="font-bold text-3xl mb-4 text-gray-800">파충류 세부정보</div> */}
            <div className="flex md:flex-row justify-between items-center mb-4 relative">
              <div className="flex flex-col">
                <MdCreate className="text-2xl absolute left-80 top-10 transform translate-x-8 -translate-y-6" />
                <input
                  type="text"
                  value={reptile?.name}
                  onChange={(e) => updateName(e.target.value)}
                  className="border-b-2 border-gray-400 py-2 pr-4 text-3xl font-semibold focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <button
                  onClick={handleSaveChanges}
                  disabled={!isEdited} // isEdited가 false일 경우 버튼을 비활성화
                  className={`border-2 py-1 px-4 rounded font-semibold transition duration-300 ${isEdited
                    ? "border-green-500 hover:bg-green-300 text-green-500" // 변경 사항이 있을 때
                    : "border-gray-500 text-gray-500 bg-gray-200 cursor-default" // 변경 사항이 없을 때
                    }`}
                >
                  저장
                </button>
              </div>
            </div>
            <hr className="border-t border-gray-200" />

            <div className="flex mt-4 mb-12 items-start">
              <div className="w-1/2 pr-6">
                <div className="relative">
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
                  <span className="text-gray-400 text-sm ml-2.5">사진은 최대 2MB 이하의 JPG, PNG, GIF 파일 3장까지 첨부 가능합니다.</span>
                  <div className="absolute right-0 bottom-5 p-2 z-10">
                    <label htmlFor="file-upload"
                      className="cursor-pointer text-4xl bg-white rounded-full p-3 shadow-lg inline-block"
                      onClick={toggleUploadPanel}>
                      <FaCamera />
                    </label>
                  </div>
                </div>
              </div>
              <div className="w-1/2">
                <div className="bg-white rounded-lg shadow-md p-5 max-w-md mx-auto mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-bold text-2xl">상세정보</div>
                    <button
                      onClick={toggleUserSelectModal}
                      className="border-blue-500 hover:bg-blue-300 text-blue-500 border-2 py-1 px-4 rounded font-semibold transition duration-300"
                    >
                      분양
                    </button>
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
                  <div className="col-span-4 flex overflow-x-auto ml-20">
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
            <div className="flex mt-4 mb-12 items-start">
              <div className="w-1/2 pr-6">
                <div className="bg-gray-100 rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold mb-4">탈피 정보</h3>
                  <ul className="space-y-4">
                    <li className="flex justify-between items-center border-b border-gray-200 pb-4">
                      <span>마지막 탈피일</span>
                      <span>2023-05-15</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-gray-200 pb-4">
                      <span>탈피주기</span>
                      <span>3-4 개월</span>
                    </li>
                    <li className="flex justify-between items-center pb-4">
                      <span>예상 탈피일</span>
                      <span>2023-08-15</span>
                    </li>
                  </ul>
                  <div className="mt-6 pl-4 border-l-4 border-gray-300">
                    <p className="text-gray-500">탈피이력</p>
                    <ul className="space-y-2 mt-2">
                      <li>2023-05-15</li>
                      <li>2022-12-01</li>
                      <li>2022-08-20</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="w-1/2">
                <ActivityChart />
              </div>
            </div>
            {isUserSelectModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg p-8 shadow-lg max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
                  <h2 className="text-2xl font-bold mb-4">사용자 선택</h2>
                  <input
                    type="text"
                    placeholder="닉네임 검색"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-4 p-2 border rounded w-full"
                  />
                  <div className="flex justify-end">
                    <button 
                      onClick={handleSearch} 
                      className="border-blue-500 hover:bg-blue-300 text-blue-500 border-2 py-1 px-4 rounded font-semibold transition duration-300"
                    >
                      검색
                    </button>
                  </div>
                  {error && <p className="text-red-500">{error}</p>}
                  <ul>
                    {filteredUsers.map(user => (
                      <li
                        key={user}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleUserSelect(user)}
                      >
                        {user}
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-end">
                    <button 
                      onClick={toggleUserSelectModal}
                      className="mt-4 border-red-500 hover:bg-red-300 text-red-500 border-2 py-1 px-4 rounded font-semibold transition duration-300"
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isAdoptModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg p-8 shadow-lg max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
                  <h2 className="text-2xl font-bold mb-4">분양 정보</h2>
                  <p>선택한 사용자: {selectedUser}</p>
                  <div className="my-4">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        className="form-checkbox w-6 h-6 text-blue-500 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                      <span className="ml-2 text-gray-700">사육 일지 공개</span>
                    </label>
                    <p className="mt-2 text-sm text-gray-600">
                      사육 일지가 다음 분양 대상자에게 공개됩니다.
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button onClick={sendAdoptionInfo} className="border-blue-500 hover:bg-blue-300 text-blue-500 border-2 py-1 px-4 rounded font-semibold transition duration-300">
                      확인
                    </button>
                    <button onClick={toggleAdoptModal} className="border-red-500 hover:bg-red-300 text-red-500 border-2 ml-4 py-1 px-4 rounded font-semibold transition duration-300">
                      닫기
                    </button>
                  </div>
                  
                </div>
              </div>
            )}

            {/* <div className="col-span-1 text-lg flex justify-center items-center">
              생년월일
            </div>
            <input
              type="date"
              className="col-span-3 p-2 border border-gray-300 rounded"
              value={formatDate(reptile?.birth)}
              onChange={(e) => updateBirth(e.target.value)}
            ></input> */}

            {/* <div className="font-bold text-3xl mb-3">건강분석</div>
            <hr className="border-t border-gray-400 mb-3" /> */}
            {/* <div className="bg-gray-300 rounded-md flex justify-center items-center">
              활동량, 탈피주기 확인 차트
              <img
                src="https://img.freepik.com/free-vector/flat-design-dynamic-veterinary-clinic-infographic_23-2149680939.jpg?t=st=1713955901~exp=1713959501~hmac=42ee9f09ccbdafe5b1fd6c05d86a55899d1bdc2022bb0b057695f7d83bfbdeb4&w=996"
                alt="활동량, 탈피주기 확인 차트"
                className='w-full'
              />
            </div> */}

            <div className="flex justify-end space-x-4 mt-16 ">
              <button
                onClick={handleDelete}
                className="border-red-500 border-2 hover:bg-red-200 text-red-500 font-semibold py-2 px-4 rounded transition duration-300"
              >
                삭제
              </button>
              <button
                onClick={handleNavigation}
                className="border-blue-500 border-2 hover:bg-blue-200 text-blue-500 font-semibold py-2 px-4 rounded transition duration-300"
              >
                목록으로 돌아가기
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={!isEdited} // isEdited가 false일 경우 버튼을 비활성화
                className={`border-2 py-2 px-4 rounded font-semibold transition duration-300 ${isEdited
                  ? "border-green-500 hover:bg-green-300 text-green-500" // 변경 사항이 있을 때
                  : "border-gray-500 text-gray-500 bg-gray-200 cursor-not-allowed" // 변경 사항이 없을 때
                  }`}
              >
                저장
              </button>
            </div>
            
          </div>
        </div>
      ) : (
        <div className="pt-10 pb-10 mx-auto max-w-screen-lg">
          <div className="bg-white rounded-lg shadow-md px-5 py-4">
            <h1 className="text-center">
              Loading...
            </h1>
          </div>
        </div>
      )}
    </>
  );
}

export default MyReptileDetail;
