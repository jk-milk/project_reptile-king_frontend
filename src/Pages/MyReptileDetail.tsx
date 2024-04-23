import { useEffect, useState } from 'react';
import { apiWithAuth } from '../components/common/axios';
import { API } from '../config';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Reptile } from '../types/Cage';
import { calculateAge } from '../utils/CalculateAge';

function MyReptileDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const reptileSerialCode = location.state.reptileSerialCode;

  const [reptile, setReptile] = useState<Reptile>();
  console.log(id);
  

  // 파충류 상세 데이터 가져오기
  useEffect(() => {
    const fetchReptile = async () => {
      const response = await apiWithAuth.get(API + "reptiles/" + reptileSerialCode);
      console.log(response);
      setReptile(response.data.reptile);
    };
    fetchReptile();
  }, [reptileSerialCode]);

  const handleEdit = () => {
    navigate(`/my-cage/reptile/edit/${id}`, {
      state: reptile
    });
  }

  const handleDelete = async () => {
    const check = confirm("정말 삭제하시겠습니까?");
    if (check) {
      console.log(id);
      const response = await apiWithAuth.delete(API + "reptiles/" + id);
      console.log(response);
      alert("삭제되었습니다.")
      navigate("/my-cage");
    }
  }

  return (
    <div className="pt-10 pb-10 mx-auto max-w-screen-lg">
      <div className="bg-white rounded-lg shadow-md px-5 py-4">
        <div className="font-bold text-3xl mb-3">{reptile?.name}</div>
        <div className="flex items-center mb-20">
          {reptile?.img_urls && (
            <div className="w-1/2 pr-6">
              <img src={reptile?.img_urls[0]} alt="파충류 이미지" className="w-full h-auto rounded-lg" />
            </div>
          )}

          <div className="w-1/2">
            <div className="flex items-center mb-3">
              <div className="font-bold text-3xl">파충류 정보</div>
              
              <div className="ml-auto">
                <button
                  onClick={handleEdit}
                  className="hover:bg-yellow-200 text-yellow-500 border-yellow-500 border-2 font-semibold py-1 px-3 rounded transition duration-300"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-400 text-white font-semibold ml-2 py-1 px-3 rounded transition duration-300"
                >
                  삭제
                </button>
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
          className="w-full h-40 border border-gray-300 rounded-md p-2 focus:outline-none cursor-default"
          value={reptile?.memo || ""} // memo가 falsy 값일 경우 빈 문자열로 대체
          readOnly
        ></textarea>
        <div className="flex justify-center"> 
          <Link to="/my-cage" className="border-blue-500 border-2 hover:bg-blue-200 text-blue-500 font-semibold py-2 px-4 rounded mt-16 transition duration-300">목록으로 돌아가기</Link>
        </div>
      </div>
    </div>
  );
}

export default MyReptileDetail;
