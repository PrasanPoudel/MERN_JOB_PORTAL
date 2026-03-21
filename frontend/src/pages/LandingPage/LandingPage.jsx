import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Pricing from "../Payment/Pricing";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import Navbar from "./../../components/layout/Navbar";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <div id="pricing">
        <Pricing notPricingPage/>
      </div>
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;
