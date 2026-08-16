import { Container } from "@workspace/ui/components/layouts"
import { activitiesGallery } from "@/data/portfolio-data"

export function ActivitiesSection() {
  return (
    <Container>
      <hgroup className="w-full space-y-2">
        <h2 className="text-2xl font-medium">Activities</h2>

        <div className="leading-7 text-muted-foreground">
          <p>
            Helping businesses build intuitive products that drive growth.
          </p>
        </div>
      </hgroup>

      <div className="grid grid-cols-2 gap-1.5 py-10 md:grid-cols-4">
        {activitiesGallery.map((column, colIdx) => (
          <div key={colIdx} className={colIdx === 0 ? "grid gap-1.5" : "grid gap-2"}>
            {column.map((imgUrl, imgIdx) => (
              <div key={imgIdx}>
                <img
                  className="size-full object-cover object-center"
                  src={imgUrl}
                  alt="gallery-photo"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </Container>
  )
}
