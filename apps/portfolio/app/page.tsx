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
  OpenSourceSection,
  TestimonialsSection,
  CertificationsSection,
  CtaSection,
} from "@/components/sections"
import { getPortfolioPageData } from "@/lib/queries"
import {
  createPersonJsonLd,
  createWebSiteJsonLd,
  getBaseUrl,
} from "@workspace/ui/lib/seo"

export const revalidate = 3600

export default async function Home() {
  const portfolioUrl = getBaseUrl("portfolio")
  const personJsonLd = createPersonJsonLd()
  const webSiteJsonLd = createWebSiteJsonLd({
    siteKey: "portfolio",
    url: portfolioUrl,
  })
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <HeroSection data={profile} />
      <StatementSection />
      <AboutSection data={profile} />
      <NowSection />
      <PrinciplesSection />
      <ProcessSection />
      <ServicesSection services={services} />
      <CaseStudiesSection caseStudies={caseStudies} />
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
