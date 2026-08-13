import { Container } from "@workspace/ui/components/layouts"

export default function CaseStudiesPage() {
  return (
    <>
      <Container className="lg:py-36">
        <hgroup className="flex w-full justify-between">
          <h2 className="text-2xl font-medium text-primary lg:text-4xl/snug">
            Selected Work{" "} <br />
            <span className="text-muted-foreground">& Case Studies</span>
          </h2>

          <div className="max-w-xl text-2xl/snug text-muted-foreground">
            <p>
              Rooted in a deep interest in data structures, network
              architecture, and AI-driven workflows, I view programming not
              merely as writing lines of code, but as a process of solving
              real-world problems through scalable solutions.
            </p>
          </div>
        </hgroup>

        <div className="grid w-full gap-y-6 sm:grid-cols-2 sm:gap-x-5 sm:py-16">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((_) => (
            <div key={_} className="relative overflow-hidden rounded-2xl">
              <img
                src="https://res.cloudinary.com/dhaonb1vn/image/upload/v1782231915/pexels-photo-35239459_igdi3o.jpg"
                alt=""
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </Container>
    </>
  )
}
