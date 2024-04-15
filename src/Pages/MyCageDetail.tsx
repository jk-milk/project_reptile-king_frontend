import { SetStateAction, useState } from 'react';
import { cage, reptile } from './MyCage';
import { FaRegCirclePlay } from "react-icons/fa6";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';

function MyCageDetail() {
  const firstCage = cage[0];
  const firstReptile = reptile[0];

  const handleEditCage = () => {
    const confirmSubmit = window.confirm('사육장 정보를 수정하시겠습니까?');
    if (confirmSubmit) {
      window.location.href = '/my-cage/edit';
    }
  };

  const [selectedOption, setSelectedOption] = useState('option1');

  const handleOptionChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSelectedOption(event.target.value);
  };
  
  const handleSaveMemo = () => {
    alert(`메모가 저장되었습니다.`);
  };

  return (
    <div className="pt-10 pb-10 mx-auto max-w-screen-lg">
      <div className="bg-white rounded-lg shadow-md px-5 py-4">
        <div className="font-bold text-3xl mb-3">{firstCage.cageName}</div>
        <div className="flex items-center mb-20">
          {/* Cage Image */}
          {firstCage.cageImage && (
            <div className="w-1/2 pr-6">
              <img src={firstCage.cageImage} alt={firstCage.cageName} className="w-full h-auto rounded-lg" />
            </div>
          )}

          {/* Reptile Info */}
          <div className="w-1/2">
            <div className="flex items-center mb-3"> {/* Modified */}
              <div className="font-bold text-3xl">파충류 정보</div>
              <div className="relative ml-4">
                <select
                  value={selectedOption}
                  onChange={handleOptionChange}
                  className="bg-white border border-gray-300 rounded-lg shadow-md py-1 px-3 focus:outline-none mr-2"
                >
                  <option value="option1">은별이</option>
                  <option value="option2">미란이</option>
                </select>
              </div>
              <div className="ml-auto">
                <button
                  onClick={handleEditCage}
                  className="bg-blue-600 hover:bg-blue-400 text-white font-semibold py-1 px-3 rounded transition duration-300"
                >
                  사육장 수정하기
                </button>
              </div>
            </div>
            <hr className="border-t border-gray-400 mb-2" />
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="font-semibold text-xl">이름</td>
                  <td className="text-lg">{firstReptile.repName}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-xl">종</td>
                  <td className="text-lg">{firstReptile.repType}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-xl">나이</td>
                  <td className="text-lg">{firstReptile.repAge}</td>
                </tr>
              </tbody>
            </table>

            <div className="font-bold text-3xl mt-20 mb-3">현재 온·습도 / 설정 온·습도</div>
            <hr className="border-t border-gray-400 mb-2" />
            <div className="flex justify-between mt-3">
              <div className="bg-gray-300 rounded-lg shadow-md py-3 px-4 w-1/2 h-28 text-center text-4xl font-bold flex justify-center items-center">
                {firstCage.cageTemperature}&#176;C / {firstCage.cageSetTemperature}&#176;C
              </div>
              <div className="bg-gray-300 rounded-lg shadow-md py-3 px-4 w-1/2 text-center ml-3 text-4xl font-bold flex justify-center items-center">
                {firstCage.cageHumidity}% / {firstCage.cageSetHumidity}%
              </div>
            </div>
            <div className="text-gray-400 mt-1">'파충KING' 어플에서 사육장의 온도 및 습도를 조절할 수 있습니다.</div>
          </div>
        </div>

        <div className="font-bold text-3xl mb-3">실시간 사육장 상태</div>
        <hr className="border-t border-gray-400 mb-3" />
        <div className="bg-gray-300 h-96 rounded-md flex justify-center items-center">
          <FaRegCirclePlay className="text-8xl text-gray-700" />
        </div>
        <div className="flex items-center justify-end mt-1">
          <Link to="/my-cage/video" className="flex items-center">
            <span className='font-semibold text-xl mr-1'>CCTV 확인하러 가기</span>
            <IoArrowForwardCircleOutline className="text-3xl" />
          </Link>
        </div>

        <div className="font-bold text-3xl mt-20">메모</div>
        <hr className="border-t border-gray-400 mt-3 mb-3" />
        <textarea
          className="w-full h-40 border border-gray-300 rounded-md p-2 focus:outline-none"
          placeholder="메모를 입력해 주세요..."
        ></textarea>
        <div className="flex justify-end">
          <button onClick={handleSaveMemo} className="bg-green-600 hover:bg-green-400 text-white font-semibold py-1 px-4 rounded transition duration-300 mt-1">저장</button>
        </div>
        <div className="flex justify-center">
          <Link to="/my-cage" className="bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded mt-16 transition duration-300">목록으로 돌아가기</Link>
        </div>
      </div>
    </div>
  );
}

export default MyCageDetail;
