"use client";

import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { ArrowRight, BookOpen, Sparkles, Compass } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const slides = [
  {
    id: 1,
    title: "Discover Stories That Expand Your Universe",
    subtitle: "Over thousands of curated titles waiting for curious minds, available to borrow with a single click.",
    image: "https://images.unsplash.com/photo-1507842229451-79b1be886a20?auto=format&fit=crop&q=80&w=1600",
    tag: "Featured Collection",
    icon: Sparkles,
  },
  {
    id: 2,
    title: "Simple, Seamless, and Community-Driven Library",
    subtitle: "Borrow books for your reading journeys, track your return dates, and share your own favorite volumes.",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1600",
    tag: "Community Shelf",
    icon: BookOpen,
  },
  {
    id: 3,
    title: "Journey Through History, Science, and Beyond",
    subtitle: "From ancient civilizations to cutting-edge science and children's fantasy tales, find your next great read.",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1600",
    tag: "Expansive Genres",
    icon: Compass,
  },
];

export function BannerSlider() {
  return (
    <section className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-xl my-6">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        className="h-[480px] sm:h-[540px] md:h-[600px] w-full"
      >
        {slides.map((slide) => {
          const Icon = slide.icon;
          return (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-full flex items-center">
                {/* Background Image with Dark Gradient Overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/70 to-transparent" />
                </div>

                {/* Slide Content */}
                <div className="relative z-10 max-w-2xl px-6 sm:px-12 md:px-16 text-white space-y-4 sm:space-y-6">
                  <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-medium">
                    <Icon className="w-4 h-4" />
                    <span>{slide.tag}</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none">
                    {slide.title}
                  </h1>

                  <p className="text-sm sm:text-base md:text-lg text-gray-200 leading-relaxed font-light">
                    {slide.subtitle}
                  </p>

                  <div className="pt-2">
                    <Link
                      href="/books"
                      className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all transform hover:-translate-y-0.5"
                    >
                      <span>Browse Books</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}

