import { useEffect, useState } from 'react';
import { apiWithAuth } from '../components/common/axios';
import { API } from '../config';

interface Cage {
  id: number;
  name: string;
}

interface Reptile {
  id: number;
  name: string;
  species: string;
}

function MyCage() {
  const [cages, setCages] = useState<Cage[]>([]);
  const [reptiles, setReptiles] = useState<Reptile[]>([]);
  const [loadingCages, setLoadingCages] = useState<boolean>(true);
  const [loadingReptiles, setLoadingReptiles] = useState<boolean>(true);

  const fetchCages = async () => {
    try {
      const response = await apiWithAuth.get(API+'cages');
      setCages(response.data);
    } catch (error) {
      console.error("케이지 목록 불러오기 에러", error);
    } finally {
      setLoadingCages(false);
    }
  };

  const fetchReptiles = async () => {
    try {
      const response = await apiWithAuth.get(API+'reptiles');
      setReptiles(response.data);
    } catch (error) {
      console.error("파충류 목록 불러오기 에러", error);
    } finally {
      setLoadingReptiles(false);
    }
  };

  useEffect(() => {
    fetchCages();
    fetchReptiles();
  }, []);

  return (
    <div className="laptop:w-[75rem] w-body mx-auto flex flex-col items-center">
      <div className="my-10 w-full">
        <h2 className="text-2xl font-bold mb-4">사육장 목록</h2>
        {loadingCages ? (
          <p>로딩 중...</p>
        ) : cages.length > 0 ? (
          <ul>
            {cages.map((cage) => (
              <li key={cage.id} className="p-2 border-b border-gray-200">
                {cage.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>사육장이 없습니다.</p>
        )}
      </div>
      <div className="my-10 w-full">
        <h2 className="text-2xl font-bold mb-4">파충류 목록</h2>
        {loadingReptiles ? (
          <p>로딩 중...</p>
        ) : reptiles.length > 0 ? (
          <ul>
            {reptiles.map((reptile) => (
              <li key={reptile.id} className="p-2 border-b border-gray-200">
                {reptile.name} ({reptile.species})
              </li>
            ))}
          </ul>
        ) : (
          <p>파충류가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default MyCage;
