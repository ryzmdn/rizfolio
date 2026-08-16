import { Badge } from "@workspace/ui/components/badge"
import { buttonVariants } from "@workspace/ui/components/button"
import { Container } from "@workspace/ui/components/layouts"
import { cn } from "@workspace/ui/lib/utils"
import { BriefcaseBusiness, Check, Star, User } from "lucide-react"
import React from "react"
import { Marquee } from "../../../packages/ui/src/components/marquee"

const includedFeatures = [
  "Private forum access",
  "Member resources",
  "Entry to annual conference",
  "Official member t-shirt",
]

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

      <Container className="space-y-16 bg-foreground py-16 md:rounded-4xl">
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

      <Container className="py-20">
        <hgroup className="w-full space-y-2">
          <h2 className="text-2xl font-medium">Services</h2>

          <div className="leading-7 text-muted-foreground">
            <p>
              A selection of projects focused on clarity, usability, and
              meaningful, lasting positive impact worldwide.
            </p>
          </div>
        </hgroup>

        <div className="flow-root w-full space-y-10 divide-y divide-border py-10">
          {[1, 2, 3, 4, 5].map((_, idx) => (
            <div key={_} className="pb-10 lg:flex">
              <div className="lg:flex-auto">
                <h3 className="relative w-max text-2xl font-medium tracking-tight text-primary">
                  Web Development{" "}
                  <small className="absolute -right-5 text-xs opacity-50">
                    0{idx + 1}
                  </small>
                </h3>
                <p className="mt-4 text-base/7 text-muted-foreground">
                  Lorem ipsum dolor sit amet consect etur adipisicing elit.
                  Itaque amet indis perferendis blanditiis repellendus etur
                  quidem assumenda.
                </p>
                <div className="mt-8 flex items-center gap-x-4">
                  <h4 className="flex-none text-sm/6 font-semibold text-accent-foreground">
                    What&apos;s included
                  </h4>
                  <div className="h-px flex-auto bg-gray-100" />
                </div>
                <ul
                  role="list"
                  className="mt-8 grid grid-cols-1 gap-4 text-sm/6 text-gray-600 sm:grid-cols-2 sm:gap-6"
                >
                  {includedFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-x-3">
                      <Check className="size-4" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
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
          <h2 className="text-2xl font-medium">Edducation</h2>

          <div className="leading-7 text-muted-foreground">
            <p>
              Helping businesses build intuitive products that drive growth.
            </p>
          </div>
        </hgroup>

        <div className="w-full bg-transparent py-12">
          {[1, 2].map((_, idx) => (
            <div
              key={_}
              className="grid w-full items-center pb-12 lg:grid-cols-4"
            >
              <div className="w-full text-sm/6">
                <h3 className="relative w-max text-2xl font-medium text-primary">
                  ABCD University{" "}
                  <small className="absolute -right-5 text-xs opacity-50">
                    0{idx + 1}
                  </small>
                </h3>
              </div>
              <div className="text-center text-muted-foreground lg:col-span-2">
                <p>Bachelor of Engineering</p>
                <p>BE, Computer Science</p>
              </div>
              <div className="flex items-center justify-end gap-x-2 leading-7 text-muted-foreground">
                <p>2023</p>
                <span>&ndash;</span>
                <p>2027</p>
              </div>
            </div>
          ))}
        </div>
      </Container>

      <Container className="py-20">
        <hgroup className="w-full space-y-2">
          <h2 className="text-2xl font-medium">Experience</h2>

          <div className="leading-7 text-muted-foreground">
            <p>
              Helping businesses build intuitive products that drive growth.
            </p>
          </div>
        </hgroup>

        <div className="flow-root w-full space-y-10 divide-y divide-border py-10">
          {[1, 2, 3, 4, 5].map((_) => (
            <div key={_} className="w-full space-y-5 bg-transparent pb-10">
              <hgroup className="flex items-center justify-between">
                <div className="w-full text-sm/6">
                  <h3 className="text-lg font-medium text-primary">
                    Freelance Web Designer
                  </h3>
                  <div className="flex items-center gap-x-2 text-muted-foreground">
                    <p>Acme, Inc.</p>
                    <span className="text-xs">&bull;</span>
                    <p>Freelance</p>
                  </div>
                  <p className="text-muted-foreground">
                    Kota Tangerang Selatan, Banten, Indonesia
                  </p>
                </div>
                <div className="text-end text-sm/6 text-muted-foreground">
                  <div className="flex items-center gap-x-1.5">
                    <p>2024</p>
                    <span>&ndash;</span>
                    <p>2025</p>
                  </div>
                  <p>Remote</p>
                </div>
              </hgroup>

              <div className="w-full leading-7">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo
                  voluptatum consectetur, animi, quam suscipit iste placeat quod
                  repellat sed explicabo dolorem delectus libero. Iste debitis
                  dolorem quasi alias beatae animi?
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((_) => (
                  <Badge key={_} variant="secondary">
                    Coding
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>

      <Container className="py-20">
        <hgroup className="w-full space-y-2">
          <h2 className="text-2xl font-medium">
            Open-source experiments & tools.
          </h2>

          <div className="leading-7 text-muted-foreground">
            <p>
              Helping businesses build intuitive products that drive growth.
            </p>
          </div>
        </hgroup>

        <div className="grid w-full gap-x-10 gap-y-14 py-10 sm:grid-cols-2">
          {[1, 2, 3, 4, 5, 6].map((_) => (
            <div key={_}>
              <hgroup className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-primary">OpenAI Code</h3>
                </div>
                <div>
                  <Badge variant="secondary">
                    <Star data-icon="inline-start" />
                    1000
                  </Badge>
                </div>
              </hgroup>

              <div className="my-5 w-full space-y-3">
                <p className="text-sm/6 text-muted-foreground">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Quisquam eaque sit nulla voluptas voluptatem, libero
                  necessitatibus voluptates velit magni incidunt illo veritatis
                  officiis vel qui excepturi pariatur facere distinctio. Beatae?
                </p>
                <Badge variant="secondary">TypeScript</Badge>
              </div>

              <div className="flex items-center gap-x-5">
                <a
                  href="http://"
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  GitHub
                </a>
                <a
                  href="http://"
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  Live Demo
                </a>
              </div>
            </div>
          ))}
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

      <Container className="py-20">
        <hgroup className="w-full space-y-2">
          <h2 className="text-2xl font-medium">Licenses & certifications</h2>

          <div className="leading-7 text-muted-foreground">
            <p>
              Helping businesses build intuitive products that drive growth.
            </p>
          </div>
        </hgroup>

        <div className="relative flow-root w-full space-y-5 py-10">
          <Marquee pauseOnHover className="[--duration:55s] [--gap:32px]">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_) => (
              <div key={_} className="aspect-4/3 max-h-64">
                <img
                  src="https://templated-assets.s3.us-east-1.amazonaws.com/public/thumbnail/97d2bca7-9815-4947-bb9d-d7f7b7f3b082.webp"
                  alt=""
                  className="size-full"
                />
              </div>
            ))}
          </Marquee>
          <Marquee
            pauseOnHover
            reverse
            className="[--duration:55s] [--gap:32px]"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_) => (
              <div key={_} className="aspect-4/3 max-h-64 w-auto">
                <img
                  src="https://templated-assets.s3.us-east-1.amazonaws.com/public/thumbnail/97d2bca7-9815-4947-bb9d-d7f7b7f3b082.webp"
                  alt=""
                  className="size-full"
                />
              </div>
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/8 bg-linear-to-r from-background/90" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/8 bg-linear-to-l from-background/90" />
        </div>
      </Container>

      <Container className="my-20 w-full bg-foreground shadow-xl md:rounded-4xl">
        <div className="px-6 py-24 text-center shadow-2xl sm:px-16">
          <div className="flex justify-center items-center gap-x-3 text-secondary mb-8">
            <BriefcaseBusiness className="size-4" />
            <p>Let&apos;s Work Together!</p>
          </div>

          <h2 className="text-4xl font-semibold tracking-tight text-balance text-secondary sm:text-5xl lg:text-6xl">
            Ready To Build Something Together
          </h2>
          <p className="mt-6 text-lg/8 text-pretty text-muted-foreground">
            Whether you&apos;re a brand, a platform or a creator - if
            you&apos;re serious about growing an audience and generating
            commercial value, let&apos;s talk.
          </p>

          <ul className="mt-16 grid gap-x-8 gap-y-10 text-secondary sm:mt-20 sm:grid-cols-2 sm:gap-y-16">
            {[1, 2].map((_) => (
              <li
                key={_}
                className="flex flex-col items-start gap-y-1 border-l border-border/10 pl-6"
              >
                <p className="text-xs text-muted-foreground">
                  Let&apos;s Connect
                </p>
                <h3 className="text-xl font-medium tracking-tight">
                  ryzmdn@contact.com
                </h3>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </>
  )
}
