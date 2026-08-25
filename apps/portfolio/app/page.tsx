import {
  HeroSection,
  StatementSection,
  AboutSection,
  NowSection,
  PrinciplesSection,
  ProcessSection,
  ServicesSection,
  CaseStudiesSection,
  EducationSection,
  ExperienceSection,
  CapabilitiesSection,
  StackArchitectureSection,
  OpenSourceSection,
  TestimonialsSection,
  CertificationsSection,
  CtaSection,
} from "@/components/sections"
import { getPortfolioPageData } from "@/lib/queries"

export const revalidate = 3600

export default async function Home() {
  const { profile, experiences, education, certifications, services } =
    await getPortfolioPageData()

  return (
    <>
      <HeroSection data={profile} />
      <StatementSection />
      <AboutSection data={profile} />
      <NowSection />
      <PrinciplesSection />
      <ProcessSection />
      <ServicesSection services={services} />
      <CaseStudiesSection />
      <EducationSection education={education} />
      <ExperienceSection experiences={experiences} />
      <CapabilitiesSection />
      <StackArchitectureSection />
      <OpenSourceSection />
      <TestimonialsSection />
      <CertificationsSection certifications={certifications} />
      <CtaSection />
    </>
  )
}
