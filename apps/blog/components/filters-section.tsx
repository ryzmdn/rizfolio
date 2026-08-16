"use client"

import React from "react"
import { ChevronsUpDown } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

export function FilterSection() {
  const [paymentMethod, setPaymentMethod] = React.useState("card")
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    push: true,
  })

  return (
    <>
      <div className="flex-1">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost">
                Sort{" "}
                <ChevronsUpDown className="size-3.5 text-muted-foreground" />
              </Button>
            }
          />
          <DropdownMenuContent className="min-w-40">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
              >
                <DropdownMenuRadioItem value="card">halo</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost">
                Topics{" "}
                <ChevronsUpDown className="size-3.5 text-muted-foreground" />
              </Button>
            }
          />
          <DropdownMenuContent className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Select Topics</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={notifications.email}
                onCheckedChange={(checked) =>
                  setNotifications({
                    ...notifications,
                    email: checked === true,
                  })
                }
              >
                Technology
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost">
                Tags{" "}
                <ChevronsUpDown className="size-3.5 text-muted-foreground" />
              </Button>
            }
          />
          <DropdownMenuContent className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Select Tags</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={notifications.email}
                onCheckedChange={(checked) =>
                  setNotifications({
                    ...notifications,
                    email: checked === true,
                  })
                }
              >
                Lifestyle
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost">
                Read Time{" "}
                <ChevronsUpDown className="size-3.5 text-muted-foreground" />
              </Button>
            }
          />
          <DropdownMenuContent className="min-w-40">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Reading Time</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
              >
                <DropdownMenuRadioItem value="card">
                  3 min
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
