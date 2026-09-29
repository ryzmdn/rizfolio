import React from "react"
import { Footer } from "@workspace/ui/components/layouts/footer"
import { buttonVariants } from "@workspace/ui/components/button"
import {
  Github,
  LinkedIn,
  Behance,
  Dribbble,
} from "@workspace/ui/constants/icons"
import { cn } from "@workspace/ui/lib/utils"
import { NavLink } from "./nav-link"

const navigation = {
  main: [
    { name: "Overview", href: "/" },
    { name: "Journey", href: "/#journey" },
    { name: "Capabilities", href: "/#capabilities" },
    { name: "Case Studies", href: "/work" },
    { name: "Solutions", href: "/#solutions" },
    { name: "License", href: "/license" },
  ],
  social: [
    {
      name: "GitHub",
      href: "https://github.com/ryzmdn",
      icon: Github,
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/in/ryzmdn",
      icon: LinkedIn,
    },
    {
      name: "Behance",
      href: "https://behance.net/ryzmdn",
      icon: Behance,
    },
    {
      name: "Dribbble",
      href: "https://dribbble.com/ryzmdn",
      icon: Dribbble,
    },
  ],
}

export function AppFooter() {
  return (
    <Footer id="footer" className="w-full px-4 pb-12">
      <div className="mx-auto max-w-7xl overflow-hidden">
        <nav
          aria-label="Footer"
          className="-mb-6 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm/6"
        >
          {navigation.main.map((item, index, array) => (
            <React.Fragment key={item.name}>
              <NavLink href={item.href} first={item.name} last={item.name} />
              {index !== array.length - 1 && (
                <span className="hidden text-xs text-muted-foreground/50 md:inline">
                  /
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-6">
          {navigation.social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "gap-x-2"
              )}
            >
              <item.icon className="size-4" data-icon="inline-start" />
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
