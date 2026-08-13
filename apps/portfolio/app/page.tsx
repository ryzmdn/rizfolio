import ButtonSwiper from "@workspace/ui/components/animate/button-swiper"
import { Container } from "@workspace/ui/components/layouts"

export default function Home() {
  return (
    <>
      <Container
        padded={false}
        className="grid lg:grid-cols-3 lg:gap-x-10 lg:py-28"
      >
        <div className="flex flex-col justify-center gap-y-6 px-4 sm:px-6 lg:px-8">
          <p className="text-2xl text-muted-foreground">Hey there! I&apos;m</p>

          <h1 className="text-5xl font-semibold text-primary lg:text-6xl">
            Rizky <br /> <span className="text-muted-foreground">Ramadhan</span>
          </h1>

          <p className="leading-6 text-muted-foreground">
            Helping brands stand out with thoughtful and compelling design
            solutions Helping brands stand out.
          </p>

          <ButtonSwiper text="Let's Connect" className="mt-3" />
        </div>

        <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-72 rounded-xl border border-border p-2">
            <div className="mx-auto aspect-3/4 size-full overflow-hidden rounded-lg shadow-2xl">
              <img
                src="https://i.pinimg.com/736x/71/48/75/714875f90b8a3226ac11c6ed09dc1715.jpg"
                alt="Rizky Ramadhan"
                loading="lazy"
                decoding="async"
                className="size-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-y-6 px-4 sm:px-6 lg:px-8">
          <div className="border-l border-ring pl-4 text-lg text-muted-foreground italic">
            Firm of the Year 2025 Font-end Developer
          </div>

          <p className="text-4xl font-semibold text-primary lg:text-5xl">
            Software <span className="text-muted-foreground">Engineer</span>
          </p>
        </div>
      </Container>

      <Container className="max-w-4xl space-y-5 py-10 text-center">
        <div>About Me</div>

        <p className="text-2xl/snug font-medium text-primary md:text-3xl/snug">
          As a Software Engineer, I help teams architect structured, detailed,
          and highly functional digital products. I am passionate about{" "}
          <span className="text-muted-foreground">
            crafting meaningful user experiences where great design isn&apos;t
            just something you look at, but something you feel with every click.
          </span>
        </p>
      </Container>
    </>
  )
}
