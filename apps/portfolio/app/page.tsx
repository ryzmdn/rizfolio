import ButtonSwiper from "@workspace/ui/components/animate/button-swiper"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { Container } from "@workspace/ui/components/layouts"
import { cn } from "@workspace/ui/lib/utils"
import { User } from "lucide-react"
import React from "react"

export default function Home() {
  return (
    <>
      <Container className="flow-root space-y-8 py-32">
        <div className="flex items-center gap-x-6">
          <div className="size-28 rounded-full bg-foreground/10 p-1.5 ring-1 ring-border ring-inset">
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
          <h2 className="text-3xl/snug font-medium">
            I design premium, high-converting digital experiences that drive
            growth.
          </h2>
          <p className="leading-7 text-muted-foreground">
            Helping brands grow through thoughtful design and user experiences
            that drive engagement, build trust, and deliver results.
          </p>
        </div>
      </Container>

      <Container>
        <h2 className="leading-7 text-accent-foreground">
          Trusted by the world&apos;s most innovative teams
        </h2>
        <div className="grid grid-cols-2 py-8 sm:grid-cols-3 lg:grid-cols-5">
          <img
            alt="Transistor"
            src="https://tailwindui.com/plus-assets/img/logos/transistor-logo-gray-900.svg"
            className="max-h-10"
          />
          <img
            alt="Reform"
            src="https://tailwindui.com/plus-assets/img/logos/reform-logo-gray-900.svg"
            className="max-h-10"
          />
          <img
            alt="Tuple"
            src="https://tailwindui.com/plus-assets/img/logos/tuple-logo-gray-900.svg"
            className="max-h-10"
          />
          <img
            alt="SavvyCal"
            src="https://tailwindui.com/plus-assets/img/logos/savvycal-logo-gray-900.svg"
            className="max-h-10"
          />
          <img
            alt="Statamic"
            src="https://tailwindui.com/plus-assets/img/logos/statamic-logo-gray-900.svg"
            className="max-h-10"
          />
        </div>
      </Container>

      <Container className="space-y-6 py-24">
        <h2 className="text-lg text-muted-foreground">About My self</h2>

        <div className="space-y-5">
          <p className="text-lg/7">
            I am a software engineer focused on building robust, scalable web
            ecosystems and cloud-native applications. I operate at the
            intersection of performant frontend engineering, distributed cloud
            infrastructure, and practical AI integrations.
          </p>
          <p className="leading-7 text-muted-foreground">
            Rather than treating code merely as syntax, I approach development
            as product architecture: every abstraction must serve business
            viability, every interface must respect user attention, and every
            database query must be intentional. When I am not orchestrating
            deployments or optimizing render cycles, I advocate for developer
            communities, experiment with open-source tools, and explore how
            emerging AI models can enhance everyday software workflows.
          </p>
        </div>

        <div className="flex items-center gap-x-4">
          {[1, 2, 3].map((item, index, array) => (
            <React.Fragment key={item}>
              <a
                href="#"
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "font-normal"
                )}
              >
                <User className="size-4" />
                <span>test@email.com</span>
              </a>

              {index !== array.length - 1 && (
                <span className="text-muted-foreground">&bull;</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 mt-12 lg:grid-cols-4">
          {[1, 2, 3, 4].map((_) => (
            <div key={_} className="flex flex-col">
              <dt className="text-muted-foreground text-sm/7">Lorem Isum Dolor</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-accent-foreground">
                60+
              </dd>
            </div>
          ))}
        </dl>
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
