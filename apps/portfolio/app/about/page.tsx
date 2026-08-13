import { Container } from "@workspace/ui/components/layouts"

const stats = [
  { id: 1, name: "Creators on the platform", value: "8,000+" },
  { id: 2, name: "Flat platform fee", value: "3%" },
  { id: 3, name: "Uptime guarantee", value: "99.9%" },
]

export default function AboutPage() {
  return (
    <>
      <Container className="grid lg:grid-cols-3 lg:gap-x-20 lg:py-36">
        <div className="flex flex-col">
          <div className="mx-auto max-w-96 rounded-xl border border-border p-2">
            <div className="mx-auto aspect-4/5 size-full overflow-hidden rounded-lg shadow-2xl">
              <img
                src="https://i.pinimg.com/736x/71/48/75/714875f90b8a3226ac11c6ed09dc1715.jpg"
                alt="Rizky Ramadhan"
                loading="lazy"
                decoding="async"
                className="size-full object-cover"
              />
            </div>
          </div>

          <dl className="flow-root space-y-5 w-full mt-6">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="flex flex-col gap-y-1 border-l border-border pl-6"
              >
                <dt className="text-sm/6 text-muted-foreground">{stat.name}</dt>
                <dd className="order-first text-2xl font-semibold tracking-tight text-primary">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flow-root space-y-5 leading-7 text-muted-foreground lg:col-span-2">
          <h1 className="mb-8 text-4xl/tight font-semibold text-primary">
            I&apos;m Rizky Ramadhan, a digital designer passionate about
            creating{" "}
            <span className="text-muted-foreground">
              intuitive, user-first experiences that help businesses connect
              with their audience
            </span>
          </h1>
          <p>
            Full-Stack Engineer, Architect, and AI Alchemist. I&apos;m not just
            a coder or a &quot;code monkey&quot;; I&apos;m a digital solution
            creator focused on building scalable, bulletproof system
            architectures from the ground up. My core strengths lie at the
            intersection of Web and Mobile Development, clean UI/UX,
            DevOps/Cloud Automation, and robust Quality Assurance—all wrapped up
            in a modern tech stack.
          </p>
          <p>
            To me, AI is no longer the future—it is today&apos;s baseline. I
            actively integrate the potential of Generative AI and Personal
            Intelligence into every product line. The result? A user experience
            that is not just personalized but incredibly intelligent—something
            traditional engineers often overlook. From designing seamless CI/CD
            pipelines and optimizing cloud server loads to keep costs in check,
            to ensuring bug-free applications through rigorous QA, I always
            ensure the product is high-performance and ready to scale to
            millions of users.
          </p>
          <p>
            My vision is simple: bridging conventional software engineering with
            the infinite potential of Artificial Intelligence, underpinned by a
            solid cloud infrastructure.
          </p>
          <p>
            Always up for a good tech talk, collaborating on ambitious projects,
            or brainstorming the most cutting-edge AI trends.
          </p>
          <p>
            Let&apos;s connect, collaborate, and create products that are far
            smarter and future-proof!
          </p>
        </div>
      </Container>
    </>
  )
}
