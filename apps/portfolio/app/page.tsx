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

      <Container className="py-32">
        <hgroup className="flex w-full justify-between">
          <h2 className="text-2xl font-medium">All My Projects</h2>

          <div className="max-w-xl text-2xl/snug text-muted-foreground">
            <p>
              A selection of projects focused on clarity, usability, and
              meaningful, lasting positive impact worldwide.
            </p>
          </div>
        </hgroup>

        <div className="grid w-full gap-y-6 sm:grid-cols-2 sm:gap-x-5 sm:py-16">
          {[1, 2, 3, 4, 5, 6].map((_) => (
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

      <Container>
        <hgroup className="flex w-full justify-between">
          <h2 className="text-3xl font-medium">What I do?</h2>

          <div className="max-w-xl text-2xl/snug text-muted-foreground">
            <p>
              A selection of projects focused on clarity, usability, and
              meaningful, lasting positive impact worldwide.
            </p>
          </div>
        </hgroup>

        <div className="flow-root space-y-10 divide-y divide-border sm:py-16">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <div key={_} className="grid pb-10 lg:grid-cols-2">
              <div className="shrink-0">
                <h3 className="relative w-max text-3xl text-accent-foreground">
                  Web Development{" "}
                  <span className="absolute top-0 -right-5 text-xs text-muted-foreground">
                    0{index + 1}
                  </span>
                </h3>
              </div>
              <div className="leading-7 text-muted-foreground">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Dolorem, nihil iure? Laboriosam at, dignissimos assumenda
                aliquam beatae a maxime fugit? Ea soluta corporis nisi
                reprehenderit est ab modi reiciendis adipisci!
              </div>
            </div>
          ))}
        </div>
      </Container>
    </>
  )
}
