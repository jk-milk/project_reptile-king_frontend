import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

const ImageSlider: React.FC = () => {
  return (
    <div className="flex justify-center">
      <div className="max-w-4xl mx-auto mt-10 mb-10">
        <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
          <SwiperSlide><img src='market_banner.png' alt="Slide 1" /></SwiperSlide>
          <SwiperSlide><img src='market_banner.png' alt="Slide 2" /></SwiperSlide>
          <SwiperSlide><img src='market_banner.png' alt="Slide 3" /></SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default ImageSlider
