import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiWithAuth } from "../components/common/axios";
import { API } from "../config";
import { Cage, Reptile } from "../types/Cage";
import { calculateAge } from "../utils/CalculateAge";

function MyCage() {
  const navigate = useNavigate();
  const [cages, setCages] = useState<Cage[] | null>();
  const [reptiles, setReptiles] = useState<Reptile[] | null>();

  // 개인 케이지 목록 가져오기
  useEffect(() => {
    const fetchCages = async () => {
      const response = await apiWithAuth.get(API + "cages");
      console.log(response);
      if (response.data.msg === "데이터 없음") {
        setCages(null);
      } else {
        setCages(response.data.cages);
      }
    };

    fetchCages();
  }, []);

  // cages가 변경되면 각각 현재 온도와 습도 가져오기
  useEffect(() => {
    const fetchCagesTempHum = async () => {
      if (cages) {
        // Promise.all을 사용하여 모든 사육장에 대한 온습도 요청을 동시에 처리
        const tempHumPromises = cages.map((cage) =>
          apiWithAuth.get(`${API}cages/${cage.serial_code}/temperature-humidity`)
        );

        try {
          // 모든 요청이 완료될 때까지 기다림
          const responses = await Promise.all(tempHumPromises);
          console.log(responses);

          // // 각 사육장에 대한 응답에서 온습도 정보를 추출하여 cages 상태에 저장
          // const updatedCages = cages.map((cage, index) => ({
          //   ...cage,
          //   // 예시 응답 구조에 따라 온습도 정보를 저장
          //   cageTemperature: responses[index].data.temperature,
          //   cageHumidity: responses[index].data.humidity,
          // }));

          // setCages(updatedCages);
        } catch (error) {
          console.error("온습도 정보를 가져오는데 실패했습니다.", error);
        }
      }
    };
    fetchCagesTempHum();
  }, [cages]); // cages 상태가 변경될 때마다 실행

  // 파충류 목록 가져오기
  useEffect(() => {
    const fetchCages = async () => {
      const response = await apiWithAuth.get(API + "reptiles");
      console.log(response);
      if (response.data.msg === "데이터 없음") {
        setReptiles(null);
      } else {
        setReptiles(response.data.reptiles);
      }
    };

    fetchCages();
  }, []);

  const handleAddCage = () => {
    navigate('/my-cage/add');
  };

  const handleAddReptile = () => {
    navigate('/my-cage/reptile/add');
  };

  return (
    <div className="pt-10 pb-10 mx-auto max-w-screen-lg">
      <div className="bg-white rounded px-5 py-4">
        <div className="flex justify-between items-center mb-3">
          <div className="font-bold text-3xl">내 사육장</div>
          <button
            onClick={handleAddCage}
            className="bg-green-600 hover:bg-green-400 text-white font-semibold py-2 px-4 rounded transition duration-300"
          >
            사육장 추가하기
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cages === undefined ? (
            <p>로딩 중...</p>
          ) : cages === null ? (
            <>
              <p>사육장이 없습니다.</p>
              <p>사육장을 추가해 주세요!</p>
            </>
          ) :
            cages.map((cage) => (
              <Link to={`/my-cage/${cage.id}`} state={{reptileSerialCode: cage.reptile_serial_code}} key={cage.id}>
                <div className="bg-white border border-gray-300 rounded shadow-lg overflow-hidden">
                  {cage.img_urls ?
                    <img 
                      src={cage.img_urls[0]} 
                      alt={cage.name} 
                      className="w-full h-48 object-cover rounded-t"
                    /> : 
                    <img 
                      src='https://capstone-project-pachungking.s3.ap-northeast-2.amazonaws.com/images/cages/defaultCageImage.jpg' // 이미지가 없을 경우 디폴트 이미지 추가
                      alt={cage.name} 
                      className="w-full h-48 object-cover rounded-t"
                    />
                  }
                  <div className="p-4">
                    <div className="text-lg font-semibold mb-2">{cage.name}</div>
                    {/* <div className="text-gray-600 mb-2">온도 : {cage.cageTemperature}°C</div>
                  <div className="text-gray-600 mb-2">습도 : {cage.cageHumidity}%</div> */}
                    <button className="bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded mt-4 transition duration-300 w-full">
                      사육장 상세보기
                    </button>
                  </div>
                </div>
              </Link>
            ))}
        </div>
        <div className="flex justify-between items-center mb-3 mt-24">
          <div className="font-bold text-3xl">내 파충류</div>
          <button
            onClick={handleAddReptile}
            className="bg-green-600 hover:bg-green-400 text-white font-semibold py-2 px-4 rounded transition duration-300"
          >
            파충류 추가하기
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {reptiles === undefined ? (
            <p>로딩 중...</p>
          ) : reptiles === null ? (
            <>
              <p>파충류가 없습니다.</p>
              <p>파충류를 추가해 주세요!</p>
            </>
          ) : reptiles.map((reptile) => (
            <Link to={`/my-cage/reptile/${reptile.id}`} key={reptile.id} state={{reptileSerialCode: reptile.serial_code}}>
              <div className="bg-white border border-gray-300 rounded shadow-lg overflow-hidden">
                {reptile.img_urls ? 
                  <img
                    src={reptile.img_urls[0]}
                    alt={reptile.name}
                    className="w-full h-48 object-cover rounded-t"
                  /> :
                  <img
                    // src='https://capstone-project-pachungking.s3.ap-northeast-2.amazonaws.com/images/reptiles/defaultReptileImage.jpg' // 이미지가 없을 경우 디폴트 이미지 추가
                    src='https://capstone-project-pachungking.s3.ap-northeast-2.amazonaws.com/images/reptiles/defaultReptileImage2.jpg' // 이미지가 없을 경우 디폴트 이미지 추가
                    alt={reptile.name}
                    className="w-full h-48 object-cover rounded-t"
                  />
                }
                <div className="p-4">
                  <div className="text-lg font-semibold mb-2">{reptile.name}</div>
                  <div className="text-gray-600 mb-2">{reptile.species}</div>
                  <div className="text-gray-600 mb-2">나이 : {calculateAge(reptile.birth)}</div>
                  <button
                    className="bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded mt-4 transition duration-300 w-full">
                    파충류 상세보기
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyCage;
