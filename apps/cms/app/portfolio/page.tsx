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
      title="Complete Portfolio Showcase Suite"
      description="Kelola profil publik, riwayat karir, rekam akademik, studi kasus mendalam, penawaran layanan, lisensi sertifikasi, dan testimoni klien."
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
