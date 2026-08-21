import {
  HeroSection,
  TrustedBySection,
  AboutSection,
  ProcessSection,
  ServicesSection,
  CaseStudiesSection,
  ActivitiesSection,
  EducationSection,
  ExperienceSection,
  CapabilitiesSection,
  OpenSourceSection,
  TestimonialsSection,
  CertificationsSection,
  CtaSection,
} from "@/components/sections"
import { getPortfolioPageData } from "@/lib/queries"

export default async function Home() {
  const {
    profile,
    experiences,
    education,
    certifications,
    services,
    caseStudies,
    testimonials,
  } = await getPortfolioPageData()

  return (
    <>
      <HeroSection data={profile} />
      <TrustedBySection />
      <AboutSection data={profile} />
      <ProcessSection />
      <ServicesSection services={services} />
      <CaseStudiesSection caseStudies={caseStudies} />
      <ActivitiesSection />
      <EducationSection education={education} />
      <ExperienceSection experiences={experiences} />
      <CapabilitiesSection />
      <OpenSourceSection />
      <TestimonialsSection testimonials={testimonials} />
      <CertificationsSection certifications={certifications} />
      <CtaSection />
    </>
  )
}
