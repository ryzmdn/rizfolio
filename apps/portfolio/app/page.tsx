import {
  HeroSection,
  StatementSection,
  CaseStudiesSection,
  ServicesSection,
  ExperienceSection,
  TestimonialsSection,
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
      <StatementSection data={profile} />
      <CaseStudiesSection caseStudies={caseStudies} />
      <ServicesSection services={services} />
      <ExperienceSection
        experiences={experiences}
        education={education}
        certifications={certifications}
      />
      <TestimonialsSection testimonials={testimonials} />
      <CtaSection />
    </>
  )
}
