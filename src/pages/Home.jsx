import Hero from "../components/Hero";
import TrendingCars from "../components/listings/TrendingCars";
import AuctionEndingSoon from "../components/listings/AuctionEnding";
import PopularBrands from "../components/PopularBrands";
import FeaturedDealers from "../components/listings/FeaturedDealers";
import TrustSignals from "../components/TrustSignals";
import SelectMode from "../components/SelectMode";
const Home = () => {
  return (
    <>
      <div className={`transition-all duration-300`}>
        <Hero />
        <TrendingCars />
        <SelectMode />
        <AuctionEndingSoon />
        <PopularBrands />
        <FeaturedDealers />
        <TrustSignals />
      </div>
    </>
  );
};

export default Home;
