import { Container } from "@workspace/ui/components/layouts"
import { cn } from "@workspace/ui/lib/utils"
import { Star } from "lucide-react"

const products = [
  {
    id: 1,
    name: "Organize Basic Set (Walnut)",
    price: "$149",
    rating: 5,
    reviewCount: 38,
    imageSrc:
      "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Wooden desk organizer set in walnut finish",
    href: "#",
  },
  {
    id: 2,
    name: "Organize Pen Holder",
    price: "$15",
    rating: 5,
    reviewCount: 18,
    imageSrc:
      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Minimalist wooden desk pen holder with pens",
    href: "#",
  },
  {
    id: 3,
    name: "Organize Sticky Note Holder",
    price: "$15",
    rating: 5,
    reviewCount: 14,
    imageSrc:
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Desktop sticky note holder and notepad setup",
    href: "#",
  },
  {
    id: 4,
    name: "Organize Phone Holder",
    price: "$15",
    rating: 4,
    reviewCount: 21,
    imageSrc:
      "https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Wooden smartphone stand on office desk",
    href: "#",
  },
  {
    id: 5,
    name: "Organize Small Tray",
    price: "$15",
    rating: 4,
    reviewCount: 22,
    imageSrc:
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Small wooden organizer tray for small desk accessories",
    href: "#",
  },
  {
    id: 6,
    name: "Organize Basic Set (Maple)",
    price: "$149",
    rating: 5,
    reviewCount: 64,
    imageSrc:
      "https://images.unsplash.com/photo-1593642532400-2682810df593?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Maple wood desk organizer basic set setup",
    href: "#",
  },
  {
    id: 7,
    name: "Out and About Bottle",
    price: "$25",
    rating: 4,
    reviewCount: 12,
    imageSrc:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Re-usable minimalist water bottle",
    href: "#",
  },
  {
    id: 8,
    name: "Daily Notebook Refill Pack",
    price: "$14",
    rating: 4,
    reviewCount: 41,
    imageSrc:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Minimalist journal notebook refill pack",
    href: "#",
  },
  {
    id: 9,
    name: "Leather Key Ring (Black)",
    price: "$32",
    rating: 5,
    reviewCount: 24,
    imageSrc:
      "https://images.unsplash.com/photo-1628149455678-16f37bc392f4?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Black leather key ring accessory",
    href: "#",
  },
]

export default function Home() {
  return (
    <>
      <Container className="py-16">
        <hgroup className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Protect your device
          </h2>
          <p className="mt-4 text-muted-foreground">
            As a digital creative, your laptop or tablet is at the center of
            your work. Keep your device safe with a fabric sleeve that matches
            in quality and looks.
          </p>
        </hgroup>

        <div className="-mx-px grid grid-cols-2 border-l border-border sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative border-r border-b border-border p-4 sm:p-6"
            >
              <img
                alt={product.imageAlt}
                src={product.imageSrc}
                className="bg-borborder-border aspect-square rounded-lg object-cover group-hover:opacity-75"
              />
              <div className="pt-10 pb-4 text-center">
                <h3 className="text-sm font-medium text-primary">
                  <a href={product.href}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </a>
                </h3>
                <div className="mt-3 flex flex-col items-center">
                  <p className="sr-only">{product.rating} out of 5 stars</p>
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <Star
                        key={rating}
                        aria-hidden="true"
                        className={cn(
                          product.rating > rating
                            ? "text-yellow-400"
                            : "opacity-25",
                          "size-5 shrink-0"
                        )}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {product.reviewCount} reviews
                  </p>
                </div>
                <p className="mt-4 text-base font-medium text-accent-foreground">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </>
  )
}
