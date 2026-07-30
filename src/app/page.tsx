import { getDoctorData } from "../lib/getDoctorData";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
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

export const revalidate = 0; // Dynamic rendering for immediate data updates

export default async function Home() {
  const data = await getDoctorData();

  return (
    <>
      <Navbar doctor={data.doctor} />
      <main id="main-content">
        <HeroSection doctor={data.doctor} />
        <StatsSection statistics={data.statistics} />
        <AboutSection doctor={data.doctor} />
        <AppointmentSection doctor={data.doctor} services={data.services} />
        <SpecialtiesSection specialties={data.specialties} />
        <ServicesSection services={data.services} />
        <WhyChooseSection />
        <TimelineSection timeline={data.timeline} />
        <PatientJourneySection />
        <TestimonialsSection testimonials={data.testimonials} />
        <GallerySection gallery={data.gallery} />
        <BlogSection blog={data.blog} />
        <FAQSection faqs={data.faqs} />
      </main>
      <Footer doctor={data.doctor} />
    </>
  );
}
