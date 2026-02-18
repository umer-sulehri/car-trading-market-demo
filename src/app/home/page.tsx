import { Metadata } from "next";
import { getSEOConfig, generateMetadata as generateSEOMetadata } from "@/config/seo";
import Hero from "@/src/components/home/Hero";
import TrendingCars from "@/src/components/home/TrendingCars";
import AuctionEndingSoon from "@/src/components/home/AuctionEnding";
import PopularBrands from "@/src/components/home/PopularBrands";
import FeaturedDealers from "@/src/components/home/FeaturedDealers";
import SelectMode from "@/src/components/home/SelectMode";
import { FC } from "react";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import SubscribeDeals from "@/src/components/home/SubscribeDeals";
import BrowseUsedCars from "@/src/components/home/BrowseUsedCars";
import SellCarCTA from "@/src/components/home/SellCarCTA";
import FAQ from "@/src/components/home/FAQ";
import FinalCTA from "@/src/components/home/FinalCTA";
import PlatformStats from "@/src/components/home/PlatformStats";
import WhyChooseUs from "@/src/components/home/WhyChooseUs";
import SellOptions from "@/src/components/home/SellOptions";
import ManagedSlider from "@/src/components/home/ManagedSlider";

export const metadata: Metadata = generateSEOMetadata(getSEOConfig("home"));

const Home: FC = () => {
  return (
    <div className="transition-all duration-300">
      <Navbar />
      <Hero />
      <SellOptions />
      <ManagedSlider />
      <TrendingCars />
      <PlatformStats />
      <BrowseUsedCars />
      <FinalCTA />
      <SellCarCTA />
      <SelectMode />
      <AuctionEndingSoon />
      <PopularBrands />
      <WhyChooseUs />
      <FeaturedDealers />
      <SubscribeDeals />
      <FAQ />
      <Footer />

    </div>
  );
};

export default Home;
