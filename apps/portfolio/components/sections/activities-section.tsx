import { Container } from "@workspace/ui/components/layouts"
import { activitiesGallery } from "@/data"

export function ActivitiesSection() {
  return (
    <Container className="py-20">
      <hgroup className="w-full space-y-2">
        <h2 className="text-2xl font-medium">Community & Collaborative Highlights</h2>

        <div className="leading-7 text-muted-foreground">
          <p>
            Engagements across developer meetups, technical conferences,
            hackathons, and collaborative engineering workshops.
          </p>
        </div>
      </hgroup>

      <div className="grid grid-cols-2 gap-2 py-10 md:grid-cols-4">
        {activitiesGallery.map((column, colIdx) => (
          <div key={colIdx} className="grid gap-2">
            {column.map((imgUrl, imgIdx) => (
              <div key={imgIdx} className="overflow-hidden rounded-lg bg-muted shadow-sm">
                <img
                  className="size-full object-cover object-center transition-transform duration-500 hover:scale-105"
                  src={imgUrl}
                  alt="community activity"
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
