import ButtonSwiper from "@workspace/ui/components/animate/button-swiper"
import { Container } from "@workspace/ui/components/layouts"

export default function Home() {
  return (
    <>
      <Container className="flow-root space-y-8 py-32">
        <div className="flex items-center gap-x-6">
          <div className="size-28 p-1.5 rounded-full bg-foreground/10 ring-1 ring-border ring-inset">
            <div className="size-full overflow-hidden rounded-full">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/d/d8/Cha_Eun-woo%2C_March_31%2C_2025.png?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original"
                alt=""
                className="size-full object-cover shadow-xl ring-1 ring-border"
              />
            </div>
          </div>

          <div>
            <h1 className="text-2xl/relaxed font-medium">Rizky Ramadhan</h1>
            <p className="text-muted-foreground">Software Engineer</p>
          </div>
        </div>

        <div className="w-full max-w-xl space-y-4">
          <h2 className="text-3xl/snug font-medium">I design premium, high-converting digital experiences that drive growth.</h2>
          <p className="leading-7 text-muted-foreground">Helping brands grow through thoughtful design and user experiences that drive engagement, build trust, and deliver results.</p>
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
