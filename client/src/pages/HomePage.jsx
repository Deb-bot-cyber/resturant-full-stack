import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import WelcomeSection from '../components/WelcomeSection';
import ExquisiteFavorites from '../components/ExquisiteFavorites';
import TestimonialSection from '../components/TestimonialSection';
import EventsSection from '../components/EventsSection';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <main className="bg-[#0A0A0A] min-h-screen">
      <Navbar />
      <Hero />
      <WelcomeSection />
      <ExquisiteFavorites />
      <TestimonialSection />
      <EventsSection />
      <Footer />
    </main>
  );
};

export default HomePage;
