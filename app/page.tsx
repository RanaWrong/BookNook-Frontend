import React from "react";
import { BannerSlider } from "@/components/home/BannerSlider";
import { NewArrivals } from "@/components/home/NewArrivals";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TopCategories } from "@/components/home/TopCategories";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BookNook | Home - A Small Online Library",
  description: "Browse, borrow, and share books in our friendly online community library.",
};

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-12">
      {/* 1. Banner / Slider with Swiper.js */}
      <BannerSlider />

      {/* 2. New Arrivals (Dynamic 6 Latest Books) */}
      <NewArrivals />

      {/* 3. Extra Section 1: How Borrowing Works */}
      <HowItWorks />

      {/* 4. Extra Section 2: Top Categories */}
      <TopCategories />
    </div>
  );
}
