"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@workspace/ui/components/layouts"
import { Button } from "@workspace/ui/components/button"
import { Info, Moon, User } from "lucide-react"
import { NavLink } from "./nav-link"

export function AppHeader() {
  const [timeData, setTimeData] = useState<{
    time: string
    ampm: string
  } | null>(null)

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })

    const updateClock = () => {
      const now = new Date()
      const formattedTime = formatter.format(now)

      const [timeString, ampmString] = formattedTime.split(" ") as [
        string,
        string,
      ]

      setTimeData({ time: timeString, ampm: ampmString })
    }

    updateClock()

    const timer = setInterval(updateClock, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <Header className="fixed top-0 left-1/2 -translate-x-1/2 z-40 w-full max-w-4xl backdrop-blur-lg">
      <div className="flex justify-between items-center px-4 py-6">
        <div className="flex items-center gap-x-2 text-sm/6">
          <div className="flex items-center text-accent-foreground">
            <p className="w-14.5">{timeData?.time}</p>
            <span className="ml-1 uppercase">{timeData?.ampm}</span>
          </div>
          <p className="text-xs text-muted-foreground/90">Jakarta (GMT+7)</p>
        </div>

        <nav className="flex items-center justify-center gap-x-6 text-sm/6">
          <NavLink href="/" first={"Overview"} last={"Overview"} />
          <NavLink href="/#journey" first={"Journey"} last={"Journey"} />
          <NavLink
            href="/#case-studies"
            first={"Case Studies"}
            last={"Case Studies"}
          />
          <NavLink
            href="/#capabilities"
            first={"Capabilities"}
            last={"Capabilities"}
          />
          <NavLink href="/#solutions" first={"Solutions"} last={"Solutions"} />
        </nav>

        <div className="flex items-center gap-x-3">
          <Button size="icon-sm" variant="secondary">
            <Info />
          </Button>
          <Button size="icon-sm" variant="secondary">
            <User />
          </Button>
          <Button size="icon-sm" variant="secondary">
            <Moon />
          </Button>
        </div>
      </div>
    </Header>
  )
}
