import {
  HeroSection,
  TrustedBySection,
  AboutSection,
  ProcessSection,
  ServicesSection,
  CaseStudiesSection,
  EducationSection,
  ExperienceSection,
  CapabilitiesSection,
  OpenSourceSection,
  TestimonialsSection,
  CertificationsSection,
  CtaSection,
} from "@/components/sections"
import { getPortfolioPageData } from "@/lib/queries"

export const revalidate = 3600

export default async function Home() {
  const {
    profile,
    experiences,
    education,
    certifications,
    services,
  } = await getPortfolioPageData()

  return (
    <>
      <HeroSection data={profile} />
      <TrustedBySection />
      <AboutSection data={profile} />
      <ProcessSection />
      <ServicesSection services={services} />
      <CaseStudiesSection />
      <EducationSection education={education} />
      <ExperienceSection experiences={experiences} />
      <CapabilitiesSection />
      <OpenSourceSection />
      <TestimonialsSection />
      <CertificationsSection certifications={certifications} />
      <CtaSection />
    </>
  )
}
