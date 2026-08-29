import { Container } from "@workspace/ui/components/layouts"
import { cn } from "@workspace/ui/lib/utils"

interface ImageSource {
  src: string
  alt: string
}

interface ShowImageListItemProps {
  text: string
  images: [ImageSource, ImageSource]
}

function RevealImageListItem({ text, images }: ShowImageListItemProps) {
  const container = "absolute right-8 -top-1 z-40 h-20 w-16"
  const effect =
    "relative duration-500 delay-100 shadow-none group-hover/reveal:shadow-xl scale-0 group-hover/reveal:scale-100 opacity-0 group-hover/reveal:opacity-100 group-hover/reveal:w-full group-hover/reveal:h-full w-16 h-16 overflow-hidden transition-all rounded-md"

  return (
    <div className="group/reveal relative size-fit overflow-visible py-8">
      <h3 className="text-4xl font-semibold text-foreground transition-opacity duration-500 group-hover/reveal:opacity-40">
        {text}
      </h3>
      <div className={container}>
        <div className={effect}>
          <img
            alt={images[1].alt}
            src={images[1].src}
            className="size-full object-cover"
          />
        </div>
      </div>
      <div
        className={cn(
          container,
          "translate-x-0 translate-y-0 rotate-0 transition-transform delay-150 duration-500 group-hover/reveal:translate-x-6 group-hover/reveal:translate-y-6 group-hover/reveal:rotate-12"
        )}
      >
        <div className={cn(effect, "duration-200")}>
          <img
            alt={images[0].alt}
            src={images[0].src}
            className="size-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}

export function ServicesSection() {
  const items: ShowImageListItemProps[] = [
    {
      text: "Branding",
      images: [
        {
          src: "https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          alt: "Image 1",
        },
        {
          src: "https://images.unsplash.com/photo-1567262439850-1d4dc1fefdd0?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          alt: "Image 2",
        },
      ],
    },
    {
      text: "Web design",
      images: [
        {
          src: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          alt: "Image 1",
        },
        {
          src: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          alt: "Image 2",
        },
      ],
    },
    {
      text: "Illustration",
      images: [
        {
          src: "https://images.unsplash.com/photo-1575995872537-3793d29d972c?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          alt: "Image 1",
        },
        {
          src: "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          alt: "Image 2",
        },
      ],
    },
  ]

  const container = "absolute -top-1 left-1/2 -transition-x-1/2 z-40 h-20 w-16"
  const effect =
    "relative duration-500 delay-100 shadow-none group-hover/reveal:shadow-xl scale-0 group-hover/reveal:scale-100 opacity-0 group-hover/reveal:opacity-100 group-hover/reveal:w-full group-hover/reveal:h-full w-16 h-16 overflow-hidden transition-all rounded-md"

  return (
    <Container id="solutions" className="space-y-12 py-20">
      <hgroup className="mx-auto max-w-2xl space-y-3 text-center">
        <p className="text-sm/6 text-muted-foreground">Services & Solutions.</p>
        <h2 className="text-2xl font-medium tracking-tight text-primary sm:text-3xl">
          Services & Technical Capabilities
        </h2>
        <p className="leading-7 text-muted-foreground">
          Comprehensive full-stack engineering solutions tailored for scaling
          startups, modern SaaS platforms, and enterprise digital
          transformations.
        </p>
      </hgroup>

      {items.map((item, index) => (
        <div
          key={index}
          className="group/reveal relative grid size-fit w-full items-center overflow-visible py-5 lg:grid-cols-5"
        >
          <div className="text-4xl font-semibold text-foreground">
            <p>0{index + 1}</p>
          </div>
          <div className="lg:col-span-2">
            <h3 className="text-4xl font-semibold text-foreground transition-opacity duration-500 group-hover/reveal:opacity-40">
              {item.text}
            </h3>
            <div className={container}>
              <div className={effect}>
                <img
                  alt={item.images[1].alt}
                  src={item.images[1].src}
                  className="size-full object-cover"
                />
              </div>
            </div>
            <div
              className={cn(
                container,
                "translate-x-0 translate-y-0 rotate-0 transition-transform delay-150 duration-500 group-hover/reveal:translate-x-6 group-hover/reveal:translate-y-6 group-hover/reveal:rotate-12"
              )}
            >
              <div className={cn(effect, "duration-200")}>
                <img
                  alt={item.images[0].alt}
                  src={item.images[0].src}
                  className="size-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="text-sm/6 text-muted-foreground lg:col-span-2">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga
              similique nam, ea eligendi, quibusdam assumenda quam nemo fugit
              quaerat minima repudiandae a nisi dicta omnis illo repellendus?
              Laudantium, aspernatur. Quaerat.
            </p>
          </div>
        </div>
      ))}
    </Container>
  )
}
