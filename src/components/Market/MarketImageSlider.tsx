import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

const ImageSlider: React.FC = () => {
  return (
    <div className="flex justify-center">
      <div className="max-w-5xl mx-auto mt-10 mb-10">
      <Swiper
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={false}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide><img src="market_banner.png" alt="Slide 1" /></SwiperSlide>
        <SwiperSlide><img src="market_banner.png" alt="Slide 2" /></SwiperSlide>
        <SwiperSlide><img src="market_banner.png" alt="Slide 3" /></SwiperSlide>
      </Swiper>
      </div>
    </div>
  );
};

export default ImageSlider
