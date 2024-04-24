import { SetStateAction, useState } from 'react';
import { FaRegCirclePlay } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const cage = [
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

function MyCageVideo() {
  const firstCage = cage[0];
  const [selectedOption, setSelectedOption] = useState('option1');

  const handleOptionChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="pt-10 pb-10 mx-auto max-w-screen-lg">
      <div className="bg-white rounded px-5 py-4">
        <div className="flex justify-between items-center mb-3">
          <div className="font-bold text-3xl">{firstCage.cageName}</div>
        </div>
        <hr className="border-t border-gray-400 mb-3" />
        {/* <div className="flex items-center">
          <div className="font-bold text-2xl mr-3">날짜선택</div>
          <select
            value={selectedOption}
            onChange={handleOptionChange}
            className="bg-white border border-gray-300 rounded-lg ml-3 shadow-md py-1 px-3 focus:outline-none"
          >
            <option value="option1">2024.04.11</option>
            <option value="option2">2024.04.12</option>
            <option value="option3">2024.04.13</option>
          </select>
        </div> */}
        <div className="bg-gray-300 h-96 rounded-md flex justify-center items-center mt-3">
          {/* <FaRegCirclePlay className="text-8xl text-gray-700" /> */}
          <img src="http://172.21.2.41:8080/stream" className='w-full h-full'/>
          {/* <img src="https://png.pngtree.com/thumb_back/fh260/background/20230609/pngtree-three-puppies-with-their-mouths-open-are-posing-for-a-photo-image_2902292.jpg" className='w-full h-full'/> */}
        </div>
        <div className="flex justify-center">
          <Link to="/my-cage/:id" className="bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded mt-8 transition duration-300">상세정보로 돌아가기</Link>
        </div>
      </div>
    </div>
  );
}

export default MyCageVideo;