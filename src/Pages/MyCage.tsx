import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiWithAuth } from "../components/common/axios";
import { API } from "../config";
import { Cage, CurCage, Reptile } from "../types/Cage";
import { calculateAge } from "../utils/CalculateAge";

function MyCage() {
  const navigate = useNavigate();
  const [cages, setCages] = useState<Cage[] | null>();
  const [reptiles, setReptiles] = useState<Reptile[] | null>();
  const [curCages, setCurCages] = useState<CurCage[] | null>();

  // 개인 케이지 목록 가져오기
  useEffect(() => {
    const fetchCages = async () => {
      try {
        const response = await apiWithAuth.get(API + "cages");
        console.log(response);
        if (response.status === 204) { // 사육장이 없는 경우
          setCages(null);
        } else {
          setCages(response.data.cages);
          const curCages = response.data.cages.map((cage: Cage) => ({
            ...cage,
            cur_temp: null, // cur_temp cur_hum null로 초기화
            cur_hum: null,
          }));
          setCurCages(curCages)
        }
      } catch (error) {
        setCages(null);
        console.error("케이지 목록 가져오기 서버 에러");
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
          apiWithAuth.get(`${API}cages/${cage.id}/latest-temperature-humidity`)
        );

        try {
          // 모든 요청이 완료될 때까지 기다림
          const responses = await Promise.all(tempHumPromises);
          console.log(responses);

          const updatedCages = curCages!.map((cage, index) => {
            const response = responses[index];
            // 응답 데이터가 있고, latestData 객체가 존재하는 경우
            if (response.data && response.data.latestData) {
              return {
                ...cage,
                cur_temp: response.data.latestData.temperature,
                cur_hum: response.data.latestData.humidity,
              };
            } else {
              // 응답 데이터가 없거나, latestData 객체가 존재하지 않는 경우
              return {
                ...cage,
                cur_temp: 20,
                cur_hum: 40,
              };
            }
          });  

          setCurCages(updatedCages);
        } catch (error) {
          console.error("온습도 정보를 가져오는데 실패했습니다.", error);
        }
      }
    };
    fetchCagesTempHum();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cages]); // cages 상태가 변경될 때마다 실행

  // 파충류 목록 가져오기
  useEffect(() => {
    const fetchCages = async () => {
      try {
        const response = await apiWithAuth.get(API + "reptiles");
        console.log(response);
        if (response.status === 204) {
          setReptiles(null);
        } else {
          setReptiles(response.data.reptiles);
        }
      } catch (error) {
        setReptiles(null);
        console.error("파충류 목록 가져오기 서버 에러");
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
          {curCages === undefined ? (
            <p>로딩 중...</p>
          ) : curCages === null ? (
            <div className="flex flex-col items-center justify-center col-span-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293H9.414a1 1 0 01-.707-.293L6.293 13.293A1 1 0 005.586 13H3" />
              </svg>
              <p className="mt-2 text-lg text-gray-600">사육장이 없습니다.</p>
              <p className="text-gray-500">사육장을 추가해 주세요!</p>
            </div>
          ) :
            curCages.map((cage) => (
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
                    <div className="text-gray-600 mb-2">온도 : {cage.cur_temp}°C</div>
                    <div className="text-gray-600 mb-2">습도 : {cage.cur_hum}%</div>
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
            <div className="col-span-full text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
              </svg>
              <p className="mt-2 text-gray-700">파충류가 없습니다.</p>
              <p className="text-gray-600">파충류를 추가해 주세요!</p>
            </div>
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
