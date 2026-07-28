import { HeroSection } from "../sections/HeroSection";
import { StatsSection } from "../sections/StatsSection";
import { AboutSection } from "../sections/AboutSection";
import { SpecialtiesSection } from "../sections/SpecialtiesSection";
import { ServicesSection } from "../sections/ServicesSection";
import { WhyChooseSection } from "../sections/WhyChooseSection";
import { TimelineSection } from "../sections/TimelineSection";
import { PatientJourneySection } from "../sections/PatientJourneySection";
import { TestimonialsSection } from "../sections/TestimonialsSection";
import { GallerySection } from "../sections/GallerySection";
import { BlogSection } from "../sections/BlogSection";
import { FAQSection } from "../sections/FAQSection";
import { AppointmentSection } from "../sections/AppointmentSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <AppointmentSection />
      <SpecialtiesSection />
      <ServicesSection />
      <WhyChooseSection />
      <TimelineSection />
      <PatientJourneySection />
      <TestimonialsSection />
      <GallerySection />
      <BlogSection />
      <FAQSection />
      
    </>
  );
}
