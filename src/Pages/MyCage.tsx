import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiWithAuth } from "../components/common/axios";
import { API } from "../config";
import { Cage, Reptile } from "../types/Cage";

export const cage = [
  {
    id: 1,
    cageName: "은별이집",
    cageTemperature: 23,
    cageSetTemperature: 30,
    cageHumidity: 20,
    cageSetHumidity: 30,
    cageVideo: "",
    cageMemo: "은별이랑 미란이집",
    cageImage: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjA1MzFfMjE5%2FMDAxNjUzOTU2OTI3NjQ1.AMLOgtUX_iqkt_xkFX97KiHUMkgplwQ4HSYV9tMH4kYg.eZI6QxK18ync5XPrBfqOS7IlNiBs8lRfe-jeZrCTit0g.JPEG.thgml9341%2FIMG_4906.jpg&type=sc960_832"
  },
  {
    id: 2,
    cageName: "미란이집",
    cageTemperature: 23,
    cageSetTemperature: 30,
    cageHumidity: 20,
    cageSetHumidity: 30,
    cageVideo: "",
    cageImage: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzAzMTRfMjI0%2FMDAxNjc4Nzc2NjM4NjE2.pzfBMk20b9cSVD6sK8yhcWnt_cEnHJgyhmjzNIsKVdUg.RF4Mw6kRUrX9M5bPcdmxgZ8_-a6z43mv0aHysvdl_CQg.JPEG.noble8477%2F%25BE%25C6%25C5%25A9%25B8%25B1%25BB%25E7%25C0%25B0%25C0%25E5_%25285%2529.jpg&type=sc960_832"
  },
];

export const reptile = [
  {
    id: 1,
    repName: "은별이",
    repType: "크레스티드 게코",
    repAge: 7,
    repImage: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzAzMzFfMjE2%2FMDAxNjgwMjY5NDI1MzU4.KrGKqXLzZSjS4GskWqVp-lqaUpPb9AJj9gQWMFU0CSEg.MWhaqAGDzP3bOoieuhaRqQrdhrLRe4TxmPv9-ULIthcg.PNG.tyttang%2FIMG_1792.JPG&type=sc960_832"
  },
  {
    id: 2,
    repName: "미란이",
    repType: "레오파드 게코",
    repAge: 4,
    repImage: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzA5MzBfMjIy%2FMDAxNjk2MDM4NTU0MTUw.YI_V0epxdV_43v18QnFVdenYew4VSMTZ4RFl-IjZwccg.5XtEKY5tmp6JX8jKoI1H3w-lm2Z4U_76OmoC1QMbRCIg.JPEG.dudlswleo%2F20230930_102257.jpg&type=sc960_832"
  },
]

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

  function calculateAge(birth: string) {
    const birthDate = new Date(birth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    // 현재 월이 태어난 월보다 작을 때 or 월은 같고 일이 작을 때
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    if (age > 0) {
      // 나이가 1살 이상일 때
      return `${age}살`;
    } else {
      // 나이가 1살 미만일 경우
      let month = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
      if (dayDifference < 0) {
        month--;
      }
      if (month > 0) {
        return `${month}개월`;
      } else {
        // 1개월 미만일 경우
        const oneDay = 1000 * 60 * 60 * 24; // 하루 -> 밀리초 변환
        const days = Math.floor((today.getTime() - birthDate.getTime()) / oneDay);
        return `${days}일`;
      }
    }
  }

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
              <Link to={`/my-cage/${cage.id}`} key={cage.id}>
                <div className="bg-white border border-gray-300 rounded shadow-lg overflow-hidden">
                  {cage.img_urls ?
                    <img 
                      src={cage.img_urls[0]} 
                      alt={cage.name} 
                      className="w-full h-48 object-cover rounded-t"
                    /> : 
                    <img 
                      src='' // 이미지가 없을 경우 디폴트 이미지 추가
                      alt={cage.name} 
                      className="w-full h-48 object-cover rounded-t"
                    />
                  }
                  <div className="p-4">
                    <div className="text-lg font-semibold mb-2">{cage.name}</div>
                    {/* <div className="text-gray-600 mb-2">온도 : {cage.cageTemperature}°C</div>
                  <div className="text-gray-600 mb-2">습도 : {cage.cageHumidity}%</div> */}
                    <button className="bg-blue-500 hover:bg-blue-40 0 text-white font-semibold py-2 px-4 rounded mt-4 transition duration-300 w-full">
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
            <Link to={`/my-cage/reptile/${reptile.id}`} key={reptile.id} >
              <div className="bg-white border border-gray-300 rounded shadow-lg overflow-hidden">
                {reptile.img_urls ? 
                  <img
                    src={reptile.img_urls[0]}
                    alt={reptile.name}
                    className="w-full h-48 object-cover rounded-t"
                  /> :
                  <img
                    src='' // 이미지가 없을 경우 디폴트 이미지 추가
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
