import Link from "next/link"
import { Container } from "@workspace/ui/components/layouts/container"
import { getCategoriesAndCourses } from "../../lib/queries"
import { GraduationCap, BookOpen } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function CategoriesIndexPage() {
  const { courses } = await getCategoriesAndCourses()

  return (
    <Container className="space-y-10 py-12">
      <div className="max-w-2xl space-y-3 border-b border-border/70 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
          <BookOpen className="size-3.5" />
          <span>Curriculum & Taxonomy</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Mata Kuliah & Topik
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Eksplorasi arsip kode sumber dan tugas akademik berdasarkan mata
          kuliah dan kurikulum universitas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
            Belum ada mata kuliah yang terdata.
          </div>
        ) : (
          courses.map((course) => (
            <Link
              key={course.name}
              href={`/?course=${encodeURIComponent(course.name)}`}
              className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:border-foreground/30 hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="size-5 text-muted-foreground transition-colors group-hover:text-foreground" />
                  <span className="text-sm font-medium text-foreground underline-offset-2 group-hover:underline">
                    {course.name}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
                <span>{course.semester || "Course"}</span>
                <span className="font-mono tabular-nums">
                  {course.count} repo{course.count > 1 ? "s" : ""}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </Container>
  )
}
