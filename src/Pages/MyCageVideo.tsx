import { SetStateAction, useState } from 'react';
import { cage } from './MyCage';
import { FaRegCirclePlay } from "react-icons/fa6";
import { Link } from 'react-router-dom';

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
        <div className="flex items-center">
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
        </div>
        <div className="bg-gray-300 h-96 rounded-md flex justify-center items-center mt-3">
          <FaRegCirclePlay className="text-8xl text-gray-700" />
        </div>
        <div className="flex justify-center">
          <Link to="/my-cage/:id" className="bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded mt-8 transition duration-300">상세정보로 돌아가기</Link>
        </div>
      </div>
    </div>
  );
}

export default MyCageVideo;