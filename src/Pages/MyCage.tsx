import { Link } from "react-router-dom";

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
    id: 1,
    repName: "미란이",
    repType: "레오파드 게코",
    repAge: 4,
    repImage: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzA5MzBfMjIy%2FMDAxNjk2MDM4NTU0MTUw.YI_V0epxdV_43v18QnFVdenYew4VSMTZ4RFl-IjZwccg.5XtEKY5tmp6JX8jKoI1H3w-lm2Z4U_76OmoC1QMbRCIg.JPEG.dudlswleo%2F20230930_102257.jpg&type=sc960_832"
  },
]

function MyCage() {
  const handleAddCage = () => {
    const confirmSubmit = window.confirm('사육장을 추가하시겠습니까?');
    if (confirmSubmit) {
      window.location.href = '/my-cage/add';
    }
  };

  const handleAddReptile = () => {
    const confirmSubmit = window.confirm('파충류를 추가하시겠습니까?');
    if (confirmSubmit) {
      window.location.href = '/my-cage/reptile/add'
    }
    
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
          {cage.map((cageItem) => (
            cageItem.cageImage && (
              <div key={cageItem.id} className="bg-white border border-gray-300 rounded shadow-lg overflow-hidden">
                <img src={cageItem.cageImage} alt={cageItem.cageName} className="w-full h-auto rounded-t" />
                <div className="p-4">
                  <div className="text-lg font-semibold mb-2">{cageItem.cageName}</div>
                  <div className="text-gray-600 mb-2">온도 : {cageItem.cageTemperature}°C</div>
                  <div className="text-gray-600 mb-2">습도 : {cageItem.cageHumidity}%</div>
                  <Link to={`/my-cage/${cageItem.id}`}>
                    <button className="bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded mt-4 transition duration-300 w-full">
                      사육장 상세보기
                    </button>
                  </Link>
                </div>
              </div>
            )
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
          {reptile.map((repItem) => (
            <div key={repItem.id} className="bg-white border border-gray-300 rounded shadow-lg overflow-hidden">
              {repItem.repImage && (
                <img
                  src={repItem.repImage}
                  alt={repItem.repName}
                  className="w-full h-48 object-cover rounded-t"
                />
              )}
              <div className="p-4">
                <div className="text-lg font-semibold mb-2">{repItem.repName}</div>
                <div className="text-gray-600 mb-2">{repItem.repType}</div>
                <div className="text-gray-600 mb-2">나이 : {repItem.repAge}</div>
                <Link to="/my-cage/reptile">
                  <button className="bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded mt-4 transition duration-300 w-full">
                    파충류 상세보기
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyCage;