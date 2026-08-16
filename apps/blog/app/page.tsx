import { FilterSection } from "@/components/filters-section"
import { Container } from "@workspace/ui/components/layouts/container"

export default function Home() {
  return (
    <>
      <Container className="py-20">
        <div className="max-w-2xl">
          <div>
            <h1 className="text-4xl font-medium tracking-tight text-balance text-primary sm:text-5xl lg:text-6xl">
              Data to enrich your online business
            </h1>
            <p className="mt-6 leading-7 text-pretty text-muted-foreground sm:text-lg/8">
              Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
              lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat.
            </p>
          </div>
        </div>
      </Container>

      <Container className="flex items-center justify-between border-y border-border py-4">
        <FilterSection />
      </Container>
    </>
  )
}
