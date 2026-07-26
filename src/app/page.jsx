import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import FloatingActions from '@/components/FloatingActions';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import BridalSuite from '@/components/sections/BridalSuite';
import Inclusions from '@/components/sections/Inclusions';
import Pricing from '@/components/sections/Pricing';
import Faqs from '@/components/sections/Faqs';
import Booking from '@/components/sections/Booking';
import Contact from '@/components/sections/Contact';

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Header />
      <main id="main">
        <Hero />
        <About />
        <BridalSuite />
        <Inclusions />
        <Pricing />
        <Faqs />
        <Booking />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
