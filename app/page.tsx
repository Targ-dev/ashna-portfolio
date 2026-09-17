import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import ProjectGallery from "@/components/sections/ProjectGallery";
import AboutSection from "@/components/sections/AboutSection";
import ExpertiseSection from "@/components/sections/ExpertiseSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProjectGallery />
        <AboutSection />
        <ExpertiseSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
