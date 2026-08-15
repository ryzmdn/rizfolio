import { buttonVariants } from "@workspace/ui/components/button"
import { Container } from "@workspace/ui/components/layouts"
import { cn } from "@workspace/ui/lib/utils"
import { User } from "lucide-react"
import React from "react"

const engineeringProcess = [
  {
    name: "Discovery & System Architecture",
    description:
      "Analyzing business requirements, defining data domain boundaries, and architecting robust API and database schemas for long-term scalability.",
    date: "Phase 01",
    dateTime: "01",
  },
  {
    name: "Deterministic Engineering",
    description:
      "Building reactive interfaces and modular backend logic using modern TypeScript standards, clean component patterns, and strict type safety.",
    date: "Phase 02",
    dateTime: "02",
  },
  {
    name: "Optimization & AI Integration",
    description:
      "Implementing serverless cloud infrastructure, connecting applied AI models, and profiling performance to ensure sub-second response times.",
    date: "Phase 03",
    dateTime: "03",
  },
  {
    name: "Edge Deployment & Handoff",
    description:
      "Shipping through automated CI/CD pipelines to edge infrastructure, configuring observability, and delivering comprehensive system documentation.",
    date: "Phase 04",
    dateTime: "04",
  },
]

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

        <dl className="mt-12 flex flex-wrap items-center justify-between gap-x-8 gap-y-16 lg:grid lg:grid-cols-4">
          {[1, 2, 3, 4].map((_) => (
            <div key={_} className="flex flex-col">
              <dt className="text-sm/7 text-muted-foreground">
                Lorem Isum Dolor
              </dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-accent-foreground">
                60+
              </dd>
            </div>
          ))}
        </dl>
      </Container>

      <Container className="bg-foreground space-y-16 py-16 md:rounded-4xl">
        <hgroup className="w-full space-y-2">
          <h2 className="text-2xl font-medium text-secondary">My Process</h2>

          <div className="leading-7 text-muted">
            <p>
              Your compass to innovation and design excellence. From exploration
              to execution, this dynamic framework fuels creativity and
              precision, ensuring your product journey aligns seamlessly with
              user desires.
            </p>
          </div>
        </hgroup>

        <div className="flow-root gap-8 space-y-20 overflow-hidden">
          {engineeringProcess.map((item) => (
            <div key={item.name}>
              <time
                dateTime={item.dateTime}
                className="flex items-center text-sm/6 font-semibold text-muted"
              >
                <svg
                  viewBox="0 0 4 4"
                  aria-hidden="true"
                  className="mr-4 size-1 flex-none"
                >
                  <circle r={2} cx={2} cy={2} fill="currentColor" />
                </svg>
                {item.date}
                <div
                  aria-hidden="true"
                  className="absolute -ml-2 h-px w-screen -translate-x-full bg-background/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
                />
              </time>
              <p className="mt-6 text-xl/8 font-medium tracking-tight text-secondary">
                {item.name}
              </p>
              <p className="mt-3.5 leading-7 text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>

      <Container className="py-32">
        <hgroup className="w-full space-y-2">
          <h2 className="text-2xl font-medium">
            Problem-Solution-Impact Case Studies
          </h2>

          <div className="leading-7 text-muted-foreground">
            <p>
              A selection of projects focused on clarity, usability, and
              meaningful, lasting positive impact worldwide.
            </p>
          </div>
        </hgroup>

        <div className="grid w-full gap-y-10 py-10 sm:grid-cols-2 sm:gap-x-5">
          {[1, 2, 3, 4, 5, 6].map((_) => (
            <div key={_} className="relative overflow-hidden">
              <div className="aspect-3/2 overflow-hidden rounded-xl shadow-xl">
                <img
                  src="https://res.cloudinary.com/dhaonb1vn/image/upload/v1782231915/pexels-photo-35239459_igdi3o.jpg"
                  alt=""
                  loading="lazy"
                  className="size-full object-cover"
                />
              </div>

              <div className="mt-4 w-full space-y-1">
                <p className="text-sm/6 text-muted-foreground">
                  Personal Branding
                </p>
                <h3 className="text-xl font-medium text-primary">
                  Orbit - SaaS Brand Experience
                </h3>
              </div>
            </div>
          ))}
        </div>
      </Container>

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
          <div className="grid gap-1.5">
            <div>
              <img
                className="size-full object-cover object-center"
                src="https://images.unsplash.com/photo-1432462770865-65b70566d673?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1950&amp;q=80"
                alt="gallery-photo"
              />
            </div>
            <div>
              <img
                className="size-full object-cover object-center"
                src="https://images.unsplash.com/photo-1629367494173-c78a56567877?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=927&amp;q=80"
                alt="gallery-photo"
              />
            </div>
            <div>
              <img
                className="size-full object-cover object-center"
                src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=2940&amp;q=80"
                alt="gallery-photo"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <div>
              <img
                className="size-full object-cover object-center"
                src="https://images.unsplash.com/photo-1552960562-daf630e9278b?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=687&amp;q=80"
                alt="gallery-photo"
              />
            </div>
            <div>
              <img
                className="size-full object-cover object-center"
                src="https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=80"
                alt="gallery-photo"
              />
            </div>
            <div>
              <img
                className="size-full object-cover object-center"
                src="https://docs.material-tailwind.com/img/team-3.jpg"
                alt="gallery-photo"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <div>
              <img
                className="size-full object-cover object-center"
                src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=2940&amp;q=80"
                alt="gallery-photo"
              />
            </div>
            <div>
              <img
                className="size-full object-cover object-center"
                src="https://docs.material-tailwind.com/img/team-3.jpg"
                alt="gallery-photo"
              />
            </div>
            <div>
              <img
                className="size-full object-cover object-center"
                src="https://images.unsplash.com/photo-1552960562-daf630e9278b?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=687&amp;q=80"
                alt="gallery-photo"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <div>
              <img
                className="size-full object-cover object-center"
                src="https://images.unsplash.com/photo-1552960562-daf630e9278b?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=687&amp;q=80"
                alt="gallery-photo"
              />
            </div>
            <div>
              <img
                className="size-full object-cover object-center"
                src="https://images.unsplash.com/photo-1629367494173-c78a56567877?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=927&amp;q=80"
                alt="gallery-photo"
              />
            </div>
          </div>
        </div>
      </Container>

      <Container className="py-20">
        <hgroup className="w-full space-y-2">
          <h2 className="text-2xl font-medium">Activities</h2>

          <div className="leading-7 text-muted-foreground">
            <p>
              Helping businesses build intuitive products that drive growth.
            </p>
          </div>
        </hgroup>

        <div className="grid gap-x-10 gap-y-12 py-14 sm:grid-cols-2">
          {[1, 2, 3, 4].map((_) => (
            <div key={_} className="w-full space-y-8 bg-transparent">
              <hgroup className="flex justify-between">
                <div className="flex items-center gap-x-5">
                  <div className="size-14 shrink-0 overflow-hidden rounded-full">
                    <img
                      src="https://images.unsplash.com/photo-1629367494173-c78a56567877?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=927&amp;q=80"
                      alt=""
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="w-full">
                    <h3 className="text-lg font-medium">John Doe</h3>
                    <a
                      href="http://"
                      className="text-sm/6 text-muted-foreground"
                    >
                      @johndoe
                    </a>
                  </div>
                </div>

                <User className="size-5 text-muted-foreground" />
              </hgroup>

              <div className="w-full">
                <p className="leading-7 text-muted-foreground">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quam
                  ut architecto magnam, fuga quidem inventore, earum obcaecati
                  soluta labore consequatur quod amet doloribus ea ipsum iure
                  accusamus veritatis aut excepturi.
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </>
  )
}
