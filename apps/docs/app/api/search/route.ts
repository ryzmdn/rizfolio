import { NextResponse } from "next/server"
import { getRepositories, getCategoriesAndCourses } from "../../../lib/queries"
import { fallbackRepoFiles } from "../../../data"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const [repos, { courses }] = await Promise.all([
      getRepositories({ limit: 50 }),
      getCategoriesAndCourses(),
    ])

    const files = fallbackRepoFiles.map((f) => ({
      id: f.id,
      repoId: f.repoId,
      path: f.path,
      filename: f.filename,
      isDirectory: f.isDirectory,
      sizeBytes: f.sizeBytes,
    }))

    return NextResponse.json({
      repos: repos.map((r) => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        description: r.description,
        category: r.category,
        courseName: r.courseName,
        techStack: r.techStack,
        starsCount: r.starsCount,
      })),
      courses,
      files,
    })
  } catch (error) {
    console.error("[Search API] Failed to fetch searchable data:", error)
    return NextResponse.json(
      { repos: [], courses: [], files: [] },
      { status: 500 }
    )
  }
}
