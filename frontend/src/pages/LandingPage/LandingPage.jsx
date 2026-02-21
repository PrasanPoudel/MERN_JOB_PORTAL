import Header from "./components/Header"
import Hero from "./components/Hero" 
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Pricing from "./components/Pricing";
import CTA from "./components/CTA";
import Footer from "./components/Footer"

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <div id="pricing">
        <Pricing />
      </div>
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;
