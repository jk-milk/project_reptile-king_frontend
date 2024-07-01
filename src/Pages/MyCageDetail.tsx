import { useEffect, useState } from 'react';
import { FaRegCirclePause, FaRegCirclePlay } from "react-icons/fa6";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { apiWithAuth } from '../components/common/axios';
import { API } from '../config';
import { AvgTempHum, Cage, Reptile } from '../types/Cage';
import { calculateAge } from '../utils/CalculateAge';
import TemHumChart from '../components/Cage/TemHumChart';
import { Autoplay, Pagination, Navigation as SwiperNavigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ImageWithDeleteButton from '../components/Board/ImageWithDeleteButton';
import { FaCamera } from 'react-icons/fa';
import { MdCreate } from 'react-icons/md';

function MyCageDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.state);

  const reptileSerialCode = location.state.cage.reptile_serial_code;
  console.log(reptileSerialCode);


  const { id } = useParams();
  const [cage, setCage] = useState<Cage>();
  const [reptiles, setReptiles] = useState<Reptile[]>();
  const [reptile, setReptile] = useState<Reptile>();
  const [curTem, setCurTem] = useState(20);
  const [curHum, setCurHum] = useState(40);
  const today = new Date().toISOString().substring(0, 10);
  const [date, setDate] = useState(today);

  const [showLive, setShowLive] = useState(false); // 실시간 사육장 상태를 보여주는지 여부
  const [hover, setHover] = useState(false); // 실시간 사육장 상태를 보여주고 있을 때, 마우스가 위에 있는지 여부
  const [avgTempHum, setAvgTempHum] = useState<AvgTempHum[]>();
  const [liveURL, setLiveURL] = useState("");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [isTemHumEdited, setIsTemHumEdited] = useState(false);


  // 케이지의 상세 데이터 가져오기
  useEffect(() => {
    const fetchCages = async () => {
      const cageResponse = await apiWithAuth.get(API + "cages/" + id);
      console.log(cageResponse);
      setCage(cageResponse.data.cage);
      // setEditedName(cageResponse.data.cage.name);
      // setTemp(cageResponse.data.cage.set_temp);
      // setHum(cageResponse.data.cage.set_hum);
      setLiveURL("http://" + cageResponse.data.cage.location + ":8080/stream")
    };
    fetchCages();
  }, [id]);

  // 케이지, 파충류 상세 데이터 가져오기
  useEffect(() => {
    const fetchCage = async () => {
      console.log(location.state.cage);
      // setCage(location.state.cage);
      // setName(location.state.name);
      // setSerialCode(location.state.serial_code);
      // if (location.state.memo !== null)
      //   setMemo(location.state.memo);
      // setImgUrls(location.state.img_urls || []);
      console.log(location.state);
      // setReptiles(location.state.reptiles);
    };
    fetchCage();
  }, [location.state]);

  // 현재 온습도 데이터 가져오기
  useEffect(() => {
    const fetchCagesTempHum = async () => {
      const response = await apiWithAuth.get(`${API}cages/${id}/latest-temperature-humidity`)
      console.log(response.data.latestData);
      if (response.data.latestData !== undefined) {
        setCurTem(response.data.latestData.temperature);
        setCurHum(response.data.latestData.humidity);
      }
    };
    fetchCagesTempHum();
    // 일정 시간마다 최신화
    const interval = setInterval(() => {
      fetchCagesTempHum();
    }, 60000); // 60초 
    return () => clearInterval(interval);
  }, [id, location]);

  // 온습도 그래프 데이터 가져오기
  useEffect(() => {
    const fetchCagesTempHumGraphs = async () => {
      const response = await apiWithAuth.get(`${API}cages/${id}/daily-temperature-humidity/${date}`)
      console.log(response);
      setAvgTempHum(response.data.avgData);
    }
    fetchCagesTempHumGraphs();
  }, [date, id]);

  // 해당 케이지에 속하는 파충류 상세 데이터 가져오기
  useEffect(() => {
    const fetchReptiles = async () => {
      console.log(reptileSerialCode);

      const response = await apiWithAuth.get(API + "reptiles/" + reptileSerialCode);
      console.log(response);
      setReptile(response.data.reptile);
    };
    fetchReptiles();
  }, [reptileSerialCode]);

  // const handleEditCage = () => {
  //   navigate(`/my-cage/edit/${id}`, {
  //     state: cage
  //   });
  // }

  const handleDeleteCage = async () => {
    const check = confirm("정말 삭제하시겠습니까?");
    if (check) {
      try {
        const response = await apiWithAuth.delete(API + "cages/" + id);
        console.log(response);
        alert("삭제되었습니다.")
        navigate("/my-cage");
      } catch (error) {
        console.error(error);
        alert("사육장 삭제 중 에러! 다시 시도해 주세요!");
      }
    }
  }

  const handleShowReptileDetail = () => {
    navigate(`/my-cage/reptile/${reptile?.id}`, { state: { reptileSerialCode: reptileSerialCode } });
  }

  const handleAddReptile = () => {
    navigate("/my-cage/reptile/add", { state: cage });
  }

  // 온도 조절 함수
  const increaseTemperature = () => {
    setCage(prevState => ({
      ...prevState,
      set_temp: prevState!.set_temp < 30 ? prevState!.set_temp + 1 : prevState!.set_temp,
    }) as Cage);
    setIsTemHumEdited(true);
  };
  const decreaseTemperature = () => {
    setCage(prevState => ({
      ...prevState,
      set_temp: prevState!.set_temp > 20 ? prevState!.set_temp - 1 : prevState!.set_temp,
    }) as Cage);
    setIsTemHumEdited(true);
  };

  // 습도 조절 함수
  const increaseHumidity = () => {
    setCage(prevState => ({
      ...prevState,
      set_hum: prevState!.set_hum < 60 ? prevState!.set_hum + 1 : prevState!.set_hum,
    }) as Cage);
    setIsTemHumEdited(true);
  };
  const decreaseHumidity = () => {
    setCage(prevState => ({
      ...prevState,
      set_hum: prevState!.set_hum > 35 ? prevState!.set_hum - 1 : prevState!.set_hum,
    }) as Cage);
    setIsTemHumEdited(true);
  };

  // 설정 확인 함수
  const confirmSettings = () => {
    alert(`온도: ${cage?.set_temp}°C, 습도: ${cage?.set_hum}% 설정됨`);
  };

  // 이름만 업데이트
  const updateName = (newName: string) => {
    setCage(prevState => ({
      ...prevState, // 기존 상태를 복사
      name: newName, // 변경할 값 업데이트
    }) as Cage);
    setIsEdited(true);
  };

  // 파충류만 업데이트
  const updateReptile = (newRetile: string) => {
    setCage(prevState => ({
      ...prevState, // 기존 상태를 복사
      reptile_serial_code: newRetile, // 변경할 값 업데이트
    }) as Cage);
    setIsEdited(true);
  };

  const toggleUploadPanel = () => {
    setShowUploadPanel(!showUploadPanel);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      // 새로 업로드할 수 있는 이미지 개수를 계산 (최대 3개 - 기존 이미지 개수)
      const availableSlots = 3 - cage!.img_urls.length;
      const filesToAdd = filesArray.slice(0, availableSlots);
      setUploadedImages([...uploadedImages, ...filesToAdd]);
      setIsEdited(true);
    }
  };

  // 기존 이미지 삭제
  const handleDeleteExistingImage = (indexToDelete: number) => {
    setCage((prevCage) => {
      const newImgUrls = prevCage.img_urls.filter((_, index) => index !== indexToDelete);
      setIsEdited(true);

      return { ...prevCage, img_urls: newImgUrls };
    });
  };

  // 새로 업로드된 이미지 삭제
  const handleDeleteUploadedImage = (indexToDelete: number) => {
    setUploadedImages((prev) => prev.filter((_, index) => index !== indexToDelete));
  };

  // 사육장 정보 수정(온습도 제외)
  const handleSaveChanges = async () => {
    const confirmSubmit = confirm('사육장 수정을 완료하시겠습니까?');

    if (confirmSubmit && cage) {
      const formData = new FormData();

      let editReptileSerialCode = ''
      if (cage.reptile_serial_code !== null)
        editReptileSerialCode = cage.reptile_serial_code

      formData.append('name', cage.name);
      formData.append('serialCode', cage.serial_code);
      formData.append('memo', cage.memo);
      formData.append('reptileSerialCode', editReptileSerialCode);
      formData.append('imgUrls', JSON.stringify(cage.img_urls));

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
        // 온습도 데이터 제외 전송
        const response = await apiWithAuth.post(`${API}cages/${id}`, formData);
        console.log(response);
        for (const pair of response.config.data.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
        alert('사육장이 성공적으로 수정되었습니다.');
        // navigate('/my-cage');
        navigate(0);
        scrollTo(0, 0);
      } catch (error) {
        console.error(error);
        alert('사육장 수정에 실패했습니다.');
      }
    }
  };

  // 온습도 변경
  const handleSaveChangesTemHum = async () => {
    const confirmSubmit = confirm('온습도 수정을 완료하시겠습니까?');

    if (confirmSubmit && cage) {
      try {
        // 온습도 설정 데이터 전송
        const tempHumResponse = await apiWithAuth.patch(`${API}cages/${id}/update-temperature-humidity`, { setTemp: cage.set_temp, setHum: cage.set_hum });
        console.log(tempHumResponse);

        alert('온습도 변경이 완료되었습니다.');
        // navigate('/my-cage');
        navigate(0);
        scrollTo(0, 0);
      } catch (error) {
        console.error(error);
        alert('온습도 변경에 실패했습니다.');
      }
    }
  };

  // 목록으로 돌아가기
  const handleNavigation = () => {
    if (isEdited || isTemHumEdited) {
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
      {cage ? (
        <div className="pt-10 pb-10 mx-auto max-w-screen-lg">
          <div className="bg-white rounded-lg shadow-md px-5 py-4">
            <div className="flex md:flex-row justify-between items-center mb-4 relative">
              <div className="flex flex-col">
                <MdCreate className="text-2xl absolute left-80 top-10 transform translate-x-8 -translate-y-6" />
                <input
                  type="text"
                  value={cage?.name}
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

            <div className="flex flex-col justify-start md:flex-row items-start mb-4">
              <div className="flex md:flex-row justify-center w-1/2 items-center">

              </div>
            </div>
            {/* <button
              onClick={handleEditCage}
              className="border-yellow-500 border-2 hover:bg-yellow-200 text-yellow-500 font-semibold py-1 px-3 rounded transition duration-300"
            >
              수정
            </button> */}

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
                  className="mySwiper max-h-[529px] h-[529px] shadow-lg rounded-lg bg-gray-300"
                >
                  {cage?.img_urls.length !== 0 ? (
                    cage.img_urls.map((url, index) => (
                      <SwiperSlide key={index}>
                        <img src={url} alt={`Slide ${index + 1}`} className="w-full h-[504px] object-contain" />
                      </SwiperSlide>
                    ))
                  ) : (
                    <SwiperSlide>
                      <img
                        src='https://capstone-project-pachungking.s3.ap-northeast-2.amazonaws.com/images/defaults/defaultCageImage.jpg'
                        alt='사육장 기본 이미지'
                        className="w-full h-[504px] object-cover object-top"
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
                <div className="bg-white rounded-lg shadow-md p-5 max-w-md mx-auto mb-6">
                  <div className="flex items-center mb-3 max-w-md mx-auto">
                    <div className="font-bold text-2xl">등록 파충류 정보</div>
                    <div className="ml-auto">
                      {reptile ? // 파충류가 등록되어 있는 경우
                        <>
                          {/* <select
                            value={reptileSerialCode}
                            onChange={(event) => {
                              updateReptile(event.target.value);
                              console.log(event.target.value); // 선택된 값 출력
                            }}
                            className="h-10 p-2 border border-gray-300 rounded mb-2">
                            <option value="none" disabled>파충류 선택</option>
                            {reptiles?.map((reptile) => (
                              <option key={reptile.id} value={reptile.serial_code}>{reptile.name}</option>
                            ))}
                          </select> */}
                          <button
                            onClick={handleShowReptileDetail}
                            className="border-blue-600 border-2 hover:bg-blue-200 text-blue-500 font-semibold py-1 px-3 rounded transition duration-300"
                          >
                            파충류 상세정보 확인
                          </button>
                        </>

                        : // 파충류가 등록되지 않았을 경우
                        <button
                          onClick={handleAddReptile}
                          className="border-blue-500 border-2 hover:bg-blue-200 text-blue-500 font-semibold py-1 px-3 rounded transition duration-300"
                        >
                          파충류 추가하기
                        </button>
                      }
                    </div>
                  </div>
                  <hr className="border-t border-gray-200 mb-2" />
                  <div className="w-full ">
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

                <div className="bg-white rounded-lg shadow-lg p-5 max-w-md mx-auto">
                  <div className="text-center mb-5 flex justify-around">
                    <h2 className="text-2xl font-semibold">온습도 설정</h2>
                    <button
                      onClick={handleSaveChangesTemHum}
                      disabled={!isTemHumEdited} // isEdited가 false일 경우 버튼을 비활성화
                      className={`border-2 my-5 py-1 px-4 rounded font-semibold transition duration-300 ${isTemHumEdited
                        ? "border-green-500 hover:bg-green-300 text-green-500" // 변경 사항이 있을 때
                        : "border-gray-500 text-gray-500 bg-gray-200 cursor-default" // 변경 사항이 없을 때
                        }`} 
                        >
                      변경
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600 mb-2 flex justify-center">현재 온도</p>
                      <p className="text-3xl font-bold flex justify-center">{curTem}°C</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-2 flex items-center justify-center">설정 온도 (20°C ~ 30°C)</p>
                      <div className="flex items-center justify-center">
                        <button onClick={decreaseTemperature} className="text-blue-700 bg-blue-100 hover:bg-blue-200 font-bold py-1.5 px-4 rounded-l-lg">
                          -
                        </button>
                        <input type="text" className="w-16 text-center text-2xl font-bold border-t-2 border-b-2 border-blue-100" value={cage.set_temp} readOnly />
                        <button onClick={increaseTemperature} className="text-blue-700 bg-blue-100 hover:bg-blue-200 font-bold py-1.5 px-3.5 rounded-r-lg">
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <hr className="border-t border-gray-200 mb-4" />
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                      <p className="text-gray-600 mb-2 flex justify-center">현재 습도</p>
                      <p className="text-3xl font-bold flex justify-center">{curHum}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-2 flex items-center justify-center">설정 습도 (35% ~ 60%)</p>
                      <div className="flex items-center justify-center">
                        <button onClick={decreaseHumidity} className="text-blue-700 bg-blue-100 hover:bg-blue-200 font-bold py-1.5 px-4 rounded-l-lg">
                          -
                        </button>
                        <input type="text" className="w-16 text-center text-2xl font-bold border-y-2 border-blue-100" value={cage.set_hum} readOnly />
                        <button onClick={increaseHumidity} className="text-blue-700 bg-blue-100 hover:bg-blue-200 font-bold py-1.5 px-3.5 rounded-r-lg">
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* <div className="flex justify-center">
                    <button onClick={confirmSettings} className="border-blue-500 border-2 hover:bg-blue-200 text-blue-500 font-bold py-2 px-8 rounded-lg">
                      설정
                    </button>
                  </div> */}
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
                      disabled={cage.img_urls.length + uploadedImages.length >= 3}
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
                    <span className="ml-6">{cage.img_urls.length + uploadedImages.length}/3</span>
                    <span className="text-gray-400 text-sm ml-6">사진은 최대 2MB 이하의 JPG, PNG, GIF 파일 3장까지 첨부 가능합니다.</span>
                  </div>
                  <div className="col-span-4 flex overflow-x-auto ml-20">
                    {cage.img_urls.map((url, index) => (
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
                  {/* <div>
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
                  </div> */}
                </div>
              </div>
            )}

            <TemHumChart data={avgTempHum} date={date} setDate={setDate} />

            <div className="font-bold text-3xl mb-3">실시간 사육장 상태</div>
            <hr className="border-t border-gray-400 mb-6" />
            <div className="bg-gray-300 mx-auto max-w-4xl h-[504px] rounded-md flex justify-center items-center relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
              {showLive ? (
                // 실시간 사육장 상태 표시
                <img src={liveURL} alt="실시간 사육장 상태" className="h-full w-full object-cover rounded-md" />
              ) : (
                // 재생 아이콘 표시
                <FaRegCirclePlay className="text-8xl text-gray-700 hover:cursor-pointer" onClick={() => setShowLive(true)} />
              )}
              {showLive && hover && ( // 실시간 사육장 상태를 표시하고 있을 때, 마우스가 그 위에 있는 경우 정지 아이콘 표시
                <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={() => setShowLive(false)}>
                  <FaRegCirclePause className="text-8xl text-gray-700" />
                </div>
              )}
            </div>
            <div className="flex items-center justify-end mt-4 mr-12">
              <button
                onClick={() => { navigate(`/my-cage/${id}/video`) }}
                className="border-blue-500 border-2 hover:bg-blue-300 text-blue-500 font-semibold py-1 px-4 rounded transition duration-300"
              >
                이전 영상 확인하러 가기
              </button>
            </div>

            <div className="flex justify-end space-x-4 mt-16 ">
              <button
                onClick={handleDeleteCage}
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

export default MyCageDetail;
