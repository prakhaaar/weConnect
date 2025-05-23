import React from "react";
import Navbar from "../components/shared/Navbar";
import Herosection from "./Herosection";
import CategoryCarousel from "./CategoryCarousel";
import LatestJobs from "./LatestJobs";
import Footer from "./shared/footer";
function Home() {
  return (
    <div>
      <Navbar />
      <Herosection />
      <CategoryCarousel />
      <LatestJobs />
      <Footer />
    </div>
  );
}

export default Home;
