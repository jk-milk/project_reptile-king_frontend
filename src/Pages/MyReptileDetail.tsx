import { reptile } from './MyCage';
import { Link } from 'react-router-dom';

function MyReptileDetail() {
  const firstReptile = reptile[0];

  const handleEditCage = () => {
    const confirmSubmit = window.confirm('파충류 정보를 수정하시겠습니까?');
    if (confirmSubmit) {
      window.location.href = '/my-cage/reptile/edit';
    }
  };
  
  const handleSaveMemo = () => {
    alert(`메모가 저장되었습니다.`);
  };

  return (
    <div className="pt-10 pb-10 mx-auto max-w-screen-lg">
      <div className="bg-white rounded-lg shadow-md px-5 py-4">
        <div className="font-bold text-3xl mb-3">{firstReptile.repName}</div>
        <div className="flex items-center mb-20">
          {/* Cage Image */}
          {firstReptile.repImage && (
            <div className="w-1/2 pr-6">
              <img src={firstReptile.repImage} alt={firstReptile.repImage} className="w-full h-auto rounded-lg" />
            </div>
          )}

          {/* Reptile Info */}
          <div className="w-1/2">
            <div className="flex items-center mb-3"> {/* Modified */}
              <div className="font-bold text-3xl">파충류 정보</div>
              
              <div className="ml-auto">
                <button
                  onClick={handleEditCage}
                  className="bg-blue-600 hover:bg-blue-400 text-white font-semibold py-1 px-3 rounded transition duration-300"
                >
                  파충류 수정하기
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
          </div>
        </div>

        <div className="font-bold text-3xl mb-3">건강분석</div>
        <hr className="border-t border-gray-400 mb-3" />
        <div className="bg-gray-300 h-96 rounded-md flex justify-center items-center">
          <div>활동량, 탈피주기 확인 차트</div>
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

export default MyReptileDetail;
