import { useEffect, useState } from 'react';
import { FaRegCirclePause, FaRegCirclePlay } from "react-icons/fa6";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { apiWithAuth } from '../components/common/axios';
import { API } from '../config';
import { AvgTempHum, Cage, Reptile } from '../types/Cage';
import { calculateAge } from '../utils/CalculateAge';
import LineChart from '../components/Cage/LineChart';

function MyCageDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const reptileSerialCode = location.state.reptileSerialCode;
  console.log(reptileSerialCode);

  const { id } = useParams();
  const [cage, setCage] = useState<Cage>();
  const [reptile, setReptile] = useState<Reptile>();
  const [curTem, setCurTem] = useState(20);
  const [curHum, setCurHum] = useState(40);
  const [editMode, setEditMode] = useState(false); // 온습도 변경 모드 상태
  const [temp, setTemp] = useState(30); // 설정온도 입력 상태
  const [hum, setHum] = useState(40); // 설정습도 입력 상태
  const [showLive, setShowLive] = useState(false); // 실시간 사육장 상태를 보여주는지 여부
  const [hover, setHover] = useState(false); // 실시간 사육장 상태를 보여주고 있을 때, 마우스가 위에 있는지 여부
  const [avgTempHum, setAvgTempHum] = useState<AvgTempHum[]>();
  // const liveURL = "http://172.21.2.41:8080/stream";
  const liveURL = "/logo.png";

  // 케이지의 상세 데이터 가져오기
  useEffect(() => {
    const fetchCages = async () => {
      const cageResponse = await apiWithAuth.get(API + "cages/" + id);
      console.log(cageResponse);
      setCage(cageResponse.data.cage);
      setTemp(cageResponse.data.set_temp);
      setHum(cageResponse.data.set_hum);
    };
    fetchCages();
  }, [id]);

  // 현재 온습도 데이터 가져오기
  useEffect(() => {
    const fetchCagesTempHum = async () => {
      if (cage) {
        const response = await apiWithAuth.get(`${API}cages/${id}/latest-temperature-humidity`)
        console.log(response.data.latestData);
        setCurTem(response.data.latestData.temperature);
        setCurHum(response.data.latestData.humidity);
      }
    }
    fetchCagesTempHum();
  }, [cage, id]);

  // 온습도 그래프 데이터 가져오기
  useEffect(() => {
    const fetchCagesTempHums = async () => {
      if (cage) {
        const response = await apiWithAuth.get(`${API}cages/${id}/daily-temperature-humidity`)
        console.log(response.data.avgData);
        setAvgTempHum(response.data.avgData);
      }
    }
    fetchCagesTempHums();
  }, [cage, id]);

  // 온습도 변경 모드 활성화
  const handleEditTempHum = () => {
    setEditMode(!editMode);
  };

  // 온습도 데이터 수정 서버에 전송하는 함수
  const handleSaveTempHum = async () => {
    console.log(`Saved Temp: ${temp}, Humidity: ${hum}`);
    const response = await apiWithAuth.patch(`${API}cages/${id}/update-temperature-humidity`, { setTemp: temp, setHum: hum });
    console.log(response);

    alert(`온도: ${temp}, 습도: ${hum}로 설정되었습니다.`);
    setEditMode(false); // 변경 모드 비활성화
    // 새로고침
  };

  // 해당 케이지에 속하는 파충류 상세 데이터 가져오기
  useEffect(() => {
    if (typeof (cage) !== "undefined") {
      const fetchReptiles = async () => {
        console.log(reptileSerialCode);

        const response = await apiWithAuth.get(API + "reptiles/" + reptileSerialCode);
        console.log(response);
        setReptile(response.data.reptile);
      };
      fetchReptiles();
    }
  }, [cage, reptileSerialCode]);

  const handleEditCage = () => {
    navigate(`/my-cage/edit/${id}`, {
      state: cage
    });
  }

  const handleDeleteCage = async () => {
    const check = confirm("정말 삭제하시겠습니까?");
    if (check) {
      console.log(id);
      const response = await apiWithAuth.delete(API + "cages/" + id);
      console.log(response);
      alert("삭제되었습니다.")
      navigate("/my-cage");
    }
  }

  // const handleEditReptile = () => {
  //   navigate(`/my-cage/reptile/edit/${id}`, {
  //     state: reptile
  //   });
  // }

  // const handleDeleteReptile = async () => {
  //   const check = confirm("정말 삭제하시겠습니까?");
  //   if (check) {
  //     console.log(id);
  //     const response = await apiWithAuth.delete(API + "cages/" + id);
  //     console.log(response);
  //     navigate("/my-cage");
  //   }
  // }

  const handleShowReptileDetail = () => {
    navigate(`/my-cage/reptile/${reptile?.id}`, { state: { reptileSerialCode: reptileSerialCode } });
  }

  const handleAddReptile = () => {
    navigate("/my-cage/reptile/add");
  }

  return (
    <div className="pt-10 pb-10 mx-auto max-w-screen-lg">
      <div className="bg-white rounded-lg shadow-md px-5 py-4">
        <div className="flex justify-between mb-3">
          <div className="font-bold text-3xl">{cage?.name}</div>
          <div className="ml-auto flex">
            <button
              onClick={handleEditCage}
              className="border-yellow-500 border-2 hover:bg-yellow-200 text-yellow-500 font-semibold py-1 px-3 rounded transition duration-300"
            >
              수정
            </button>
            <button
              onClick={handleDeleteCage}
              className="border-red-600 border-2 hover:bg-red-200 text-red-500 font-semibold ml-2 py-1 px-3 rounded transition duration-300"
            >
              삭제
            </button>
          </div>
        </div>
        <div className="flex items-center">
          {cage?.img_urls && (
            <div className="w-1/2 pr-6">
              <img src={cage?.img_urls[0]} alt={cage.name} className="w-full h-auto rounded-lg" />
            </div>
          )}
          <div className="w-1/2">
            <div className="flex items-center mb-3">
              <div className="font-bold text-3xl">파충류 정보</div>
              <div className="ml-auto">
                {reptile ? // 파충류가 등록되어 있는 경우
                  <button
                    onClick={handleShowReptileDetail}
                    className="border-blue-600 border-2 hover:bg-blue-200 text-blue-500 font-semibold py-1 px-3 rounded transition duration-300"
                  >
                    파충류 상세 확인하기
                  </button>
                  : // 파충류가 등록되지 않았을 경우
                  <button
                    onClick={handleAddReptile}
                    className="border-blue-600 border-2 hover:bg-blue-200 text-blue-500 font-semibold py-1 px-3 rounded transition duration-300"
                  >
                    파충류 추가하기
                  </button>
                }
              </div>
            </div>
            <hr className="border-t border-gray-400 mb-2" />
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="font-semibold text-xl">이름</td>
                  <td className="text-lg">{reptile?.name}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-xl">종</td>
                  <td className="text-lg">{reptile?.species}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-xl">나이</td>
                  <td className="text-lg">{calculateAge(reptile?.birth)}</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-between mt-20 mb-3">
              <div className="font-bold text-3xl">현재 온·습도 / 설정 온·습도</div>
              <button
                onClick={handleEditTempHum}
                className="border-yellow-500 border-2 hover:bg-yellow-200 text-yellow-500 font-semibold py-1 px-3 rounded transition duration-300"
              >
                변경
              </button>
            </div>
            <hr className="border-t border-gray-400 mb-2" />
            <div className="flex justify-between mt-3">
              <div className="flex flex-col items-center w-1/2">
                <div className="text-lg font-semibold mb-2">현재 온·습도</div>
                <div className="bg-gray-300 rounded-lg shadow-md py-3 px-4 h-28 text-center text-4xl font-bold flex justify-center items-center">
                  {curTem}&#176;C / {curHum}%
                </div>
              </div>
              <div className="flex flex-col items-center w-1/2 ml-3">
                <div className="text-lg font-semibold mb-2">설정 온·습도</div>
                <div className="bg-gray-300 rounded-lg shadow-md py-3 px-4 h-28 text-center text-4xl font-bold flex justify-center items-center">
                  {cage?.set_temp}&#176;C / {cage?.set_hum}%
                </div>
              </div>
            </div>

            <div className={`${editMode ? 'opacity-100 ': 'opacity-0 overflow-hidden' } h-auto transition-opacity duration-300`}>
              <div className="mt-4">
                <div className="flex justify-between gap-4">
                  <div className="flex-1">
                    <label htmlFor="tempInput" className="block text-sm font-medium text-gray-700">온도 설정</label>
                    <input
                      id="tempInput"
                      type="number"
                      placeholder="온도 설정"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                      value={temp}
                      onChange={(e) => setTemp(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="humidityInput" className="block text-sm font-medium text-gray-700">습도 설정</label>
                    <input
                      id="humidityInput"
                      type="number"
                      placeholder="습도 설정"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm"
                      value={hum}
                      onChange={(e) => setHum(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="mt-4 text-right">
                  <button
                    onClick={handleSaveTempHum}
                    className="bg-green-600 hover:bg-green-400 text-white font-semibold py-2 px-4 rounded transition duration-300">
                    저장
                  </button>
                </div>
              </div>
            </div>

            {/* <div className="text-gray-400 mt-1">'파충KING' 어플에서 사육장의 온도 및 습도를 조절할 수 있습니다.</div> */}
          </div>
        </div>

        <LineChart data={avgTempHum} />

        <div className="font-bold text-3xl mb-3">실시간 사육장 상태</div>
        <hr className="border-t border-gray-400 mb-3" />
        <div className="bg-gray-300 h-96 rounded-md flex justify-center items-center relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
          {showLive ? (
            // 실시간 사육장 상태 표시
            <img src={liveURL} alt="실시간 사육장 상태" className="h-full w-full object-cover rounded-md" />
          ) : (
            // 재생 아이콘 표시
            <FaRegCirclePlay className="text-8xl text-gray-700" onClick={() => setShowLive(true)} />
          )}
          {showLive && hover && ( // 실시간 사육장 상태를 표시하고 있을 때, 마우스가 그 위에 있는 경우 정지 아이콘 표시
            <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={() => setShowLive(false)}>
              <FaRegCirclePause className="text-8xl text-gray-700" />
            </div>
          )}
        </div>
        <div className="flex items-center justify-end mt-1">
          <button className="flex items-center" onClick={() => { navigate(`/my-cage/${id}/video`) }}>
            <span className='font-semibold text-xl mr-1'>CCTV 확인하러 가기</span>
            <IoArrowForwardCircleOutline className="text-3xl" />
          </button>
        </div>
        <div className="font-bold text-3xl mt-20">메모</div>
        <hr className="border-t border-gray-400 mt-3 mb-3" />
        <textarea
          className="w-full h-40 border border-gray-300 rounded-md p-2 focus:outline-none cursor-default resize-none overflow-auto"
          value={cage?.memo || ""} // memo가 falsy 값일 경우 빈 문자열로 대체
          readOnly
        ></textarea>
        <div className="flex justify-center">
          <Link to="/my-cage" className="bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded mt-16 transition duration-300">목록으로 돌아가기</Link>
        </div>
      </div>
    </div>
  );
}

export default MyCageDetail;
