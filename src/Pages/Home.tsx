import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Layout/Footer/Footer";
import Navbar from "../components/Layout/Header/Navbar";
import Dots from "../components/Dots";
// import { API } from "../config";
// import axios from "axios";

const Home = () => {
  const outerDivRef = useRef<HTMLDivElement | null>(null); // MainPage 자체
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); // 현재 내부 페이지 번호
  const canScroll = useRef(true);

  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    navigate(path);
  };

  const scrollDown = () => {
    const pageHeight = outerDivRef.current?.children.item(0)?.clientHeight; // 내부 페이지 높이를 계산

    if (outerDivRef.current && pageHeight) {
      // 계산한 페이지 높이만큼 좌표 이동
      outerDivRef.current.scrollTo({
        top: pageHeight * (currentPage + 1),
        left: 0,
        behavior: "smooth", // 부드럽게 이동
      });

      // 페이지 이동 중에 또 스크롤이 인식되어 여러 페이지가 한번에 넘어가는 것을 방지
      canScroll.current = false;
      setTimeout(() => {
        canScroll.current = true;
      }, 500);

      if (currentPage < outerDivRef.current.childElementCount - 1)
        // 현재 페이지가 전체 페이지 인덱스보다 작을 경우에만 현재 페이지를 1 증가
        setCurrentPage(currentPage + 1);
    }
  };

  const scrollUp = () => {
    const pageHeight = outerDivRef.current?.children.item(0)?.clientHeight;

    if (outerDivRef.current && pageHeight && currentPage > 0) {
      outerDivRef.current.scrollTo({
        top: pageHeight * (currentPage - 1),
        left: 0,
        behavior: "smooth",
      });

      canScroll.current = false;
      setTimeout(() => {
        canScroll.current = true;
      }, 500);

      setCurrentPage(currentPage - 1);
    }
  };

  const wheelHandler = (e: WheelEvent) => {
    if (!canScroll.current) return;

    if (e.deltaY > 0) {
      scrollDown();
    } else {
      scrollUp();
    }
  };

  const scrollHandler = (e: Event) => {
    e.preventDefault();
  };

  const movePageTo = (index: number) => {
    const pageHeight = outerDivRef.current?.children.item(0)?.clientHeight;
    if (outerDivRef.current && pageHeight) {
      outerDivRef.current.scrollTo({
        top: pageHeight * index,
        left: 0,
        behavior: "smooth",
      });

      canScroll.current = false;
      setTimeout(() => {
        canScroll.current = true;
      }, 500);

      setCurrentPage(index);
    }
  };

  useEffect(() => {
    const outer = outerDivRef.current;
    if (!outer) return;
    outer.addEventListener("wheel", wheelHandler);
    outer.addEventListener("scroll", scrollHandler);

    return () => {
      if (outer) {
        outer.removeEventListener("wheel", wheelHandler);
        outer.removeEventListener("scroll", scrollHandler);
      }
    };
  });

  useEffect(() => {
    setNumberOfPages((outerDivRef.current?.children.length || 1) - 1);
  }, []);

  // const refresh = async () => {
  //   const refreshToken = localStorage.getItem('refreshToken');
  //   console.log("로컬스토리지에서 가져온 리프레쉬토큰", refreshToken);
    
  //   try {
  //     const response = await axios.post(`${API}refresh-token`, {}, {
  //       headers: {
  //         'Authorization': refreshToken
  //       }
  //     });
  //     console.log(response);
  //   } catch(error) {
  //     console.error("토큰 갱신 실패", error);
  //   }
  // }

  return (
    <>
      <Navbar />
      <Dots numberOfPages={numberOfPages} currentPage={currentPage} movePageTo={movePageTo} />
      <div className="h-screen overflow-hidden scrollbar-hide" ref={outerDivRef}>
        <div className="relative h-screen w-screen bg-[url('./assets/reptile1.png')] bg-cover">
          <div className="absolute top-24 left-28 leading-[6rem] max-w-xl">
            <p className="block">
              <span className="text-mainTextColor text-7xl font-bold font-sans">爬虫類</span>
              <span className="text-white text-6xl font-bold font-sans">を愛する</span>
            </p>
            {/* <button onClick={refresh}>
              refresh
            </button> */}
            <span className="text-white text-6xl font-bold font-home">方々のために</span>
            <span className="block text-white text-7xl font-bold font-home">最高のサービス</span>
          </div>
          <button className="absolute bottom-10 right-64 px-2 py-4 bg-[rgba(255,255,255,0.00)] border-solid border-white border-2 text-white text-center font-sans text-3xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white" onClick={() => navigateTo('/my-cage')}>
            飼育ケージへ
          </button>
        </div>
        <div className="relative h-screen w-screen bg-[url('./assets/reptile2.png')] bg-cover">
          <p className="absolute top-20 right-40 max-w-xl">
            <span className="block text-white text-5xl font-bold font-sans leading-[4rem]">かわいい爬虫類の</span>
            <span className="block text-white text-5xl font-bold font-sans leading-[4rem]">飼育ケージを</span>
            <span className="block text-white text-5xl font-bold font-sans leading-[4rem]">きれいに飾ってみましょう</span>
          </p>
          <button className="absolute left-1/2 transform -translate-x-1/2 bottom-20 px-3 py-4 bg-[rgba(255,255,255,0.00)] border-solid border-white border-2 text-white text-center font-sans text-3xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white" onClick={() => navigateTo('/market')}>
            マーケットへ
          </button>
        </div>
        <div className="relative h-screen w-screen bg-[url('./assets/reptile3.png')] bg-cover">
          <p className="absolute bottom-10 left-14 max-w-4xl">
            <span className="block text-white text-7xl font-bold font-home leading-[6rem]">爬虫類コミュニティ、 </span>
            <span className="block text-white text-7xl font-bold font-home leading-[6rem]">みなさんのストーリーと </span>
            <span className="block text-white text-7xl font-bold font-home leading-[6rem]">経験が出会う場所 </span>
          </p>
          <button className="absolute top-48 right-32 px-3 py-4 bg-[rgba(255,255,255,0.00)] border-solid border-white border-2 text-white text-center font-sans text-3xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white" onClick={() => navigateTo('/board')}>
            コミュニティへ
          </button>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
