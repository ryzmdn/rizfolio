import { CmsPageShell } from "@/components/cms-page-shell"
import { PortfolioManagerView } from "@/components/portfolio/portfolio-manager-view"
import {
  getProfile,
  getExperiences,
  getEducation,
  getCaseStudies,
  getServices,
  getCertifications,
  getTestimonials,
} from "@/lib/actions/portfolio-actions"

export const dynamic = "force-dynamic"

export default async function PortfolioManagerPage() {
  const [
    profileData,
    experiences,
    education,
    caseStudies,
    services,
    certifications,
    testimonials,
  ] = await Promise.all([
    getProfile(),
    getExperiences(),
    getEducation(),
    getCaseStudies(),
    getServices(),
    getCertifications(),
    getTestimonials(),
  ])

  return (
    <CmsPageShell
      title="Portfolio Studio"
      description="Pusat kendali profil publik, riwayat karir, pendidikan, studi kasus teknik, layanan, sertifikasi, dan testimoni."
    >
      <PortfolioManagerView
        profileData={profileData}
        experiences={experiences}
        education={education}
        caseStudies={caseStudies}
        services={services}
        certifications={certifications}
        testimonials={testimonials}
      />
    </CmsPageShell>
  )
}
