import * as React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import FeaturedProducts from '../components/FeaturedProducts';
import ServicesSection from '../components/ServicesSection';
import WhyChooseUs from '../components/WhyChooseUs';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <FeaturedProducts />
      <ServicesSection />
      <WhyChooseUs />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Home;

