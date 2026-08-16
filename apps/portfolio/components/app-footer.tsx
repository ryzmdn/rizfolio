import React from "react"
import { Footer } from "@workspace/ui/components/layouts/footer"
import { buttonVariants } from "@workspace/ui/components/button"
import { Facebook, Github, Instagram, Youtube } from "@workspace/ui/constants/icons"

const navigation = {
  main: [
    { name: "Overview", href: "/" },
    { name: "Journey", href: "/#journey" },
    { name: "Capabilities", href: "/#capabilities" },
    { name: "Case Studies", href: "/#case-studies" },
    { name: "Solutions", href: "/#solutions" },
    { name: "License", href: "/license" },
  ],
  social: [
    {
      name: "Facebook",
      href: "/#",
      icon: Facebook,
    },
    {
      name: "Instagram",
      href: "/#",
      icon: Instagram,
    },
    {
      name: "GitHub",
      href: "/#",
      icon: Github,
    },
    {
      name: "YouTube",
      href: "/#",
      icon: Youtube,
    },
  ],
}

export function AppFooter() {
  return (
    <Footer className="w-full px-4 pb-12">
      <div className="mx-auto max-w-7xl overflow-hidden">
        <nav
          aria-label="Footer"
          className="-mb-6 flex flex-wrap justify-center items-center gap-x-5 gap-y-3 text-sm/6"
        >
          {navigation.main.map((item, index, array) => (
            <React.Fragment key={item.name}>
              <a
                href={item.href}
                className={buttonVariants({ variant: "link", size: "sm" })}
              >
                {item.name}
              </a>
              {index !== array.length - 1 && (
                <span className="text-xs text-muted-foreground/50">/</span>
              )}
            </React.Fragment>
          ))}
        </nav>
        <div className="mt-16 flex flex-wrap justify-center items-center gap-x-6">
          {navigation.social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <item.icon className="size-5" />
              <span>{item.name}</span>
            </a>
          ))}
        </div>
        <p className="mt-10 text-center text-sm/6 text-muted-foreground">
          &copy; {new Date().getFullYear()} GNU Affero General Public License
          v3.0. All rights reserved.
        </p>
      </div>
    </Footer>
  )
}
