"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

type CarouselProps = {
  media: string[];
};

export default function Carousel({ media }: CarouselProps) {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      spaceBetween={10}
      slidesPerView={1}
      loop={true}
    >
      {media.map((src, index) => (
        <SwiperSlide key={index}>
          <Image
            src={src}
            alt={`Slide ${index + 1}`}
            className="w-full h-96 object-cover"
            width={800}
            height={450}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
