import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Shield, FileText, CheckCircle2 } from "lucide-react"
import { Container } from "@workspace/ui/components/layouts"
import { getBaseUrl, SEO_CONFIG } from "@workspace/ui/lib/seo"

const baseUrl = getBaseUrl("portfolio")
const pageUrl = `${baseUrl}/license`

export const metadata: Metadata = {
  title: `Open Source Licensing & Terms | ${SEO_CONFIG.author.name}`,
  description:
    "Open source licensing terms, software redistribution guidelines, and commercial usage rights for the Rizfolio ecosystem.",
  alternates: { canonical: pageUrl },
}

export default function LicensePage() {
  return (
    <div className="space-y-12 py-10 sm:py-16">
      <Container>
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Return to Portfolio</span>
        </Link>
      </Container>

      <Container className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <Shield className="size-3" />
          <span>Legal & Licensing Framework</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Open Source License & Usage Terms
        </h1>

        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Rizfolio and its associated public engineering libraries are released
          under open source standards designed to foster community collaboration
          while ensuring transparent attribution.
        </p>
      </Container>

      <Container>
        <div className="rounded-2xl border border-border/80 bg-card/60 p-6 backdrop-blur-xs sm:p-10 space-y-8">
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">
              GNU Affero General Public License v3.0 (AGPL-3.0)
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Permissions of this strongest copyleft license are conditioned on
              making available complete source code of licensed works and
              modifications, which include larger works using a licensed work,
              under the same license. Copyright and license notices must be
              preserved. Contributors provide an express grant of patent rights.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 border-y border-border/60 py-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">
                Permissions
              </span>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3 text-emerald-500" />
                  Commercial use
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3 text-emerald-500" />
                  Modification
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3 text-emerald-500" />
                  Distribution
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3 text-emerald-500" />
                  Patent use
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">
                Conditions
              </span>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5">
                  <FileText className="size-3 text-blue-500" />
                  Disclose source
                </li>
                <li className="flex items-center gap-1.5">
                  <FileText className="size-3 text-blue-500" />
                  License and copyright notice
                </li>
                <li className="flex items-center gap-1.5">
                  <FileText className="size-3 text-blue-500" />
                  State changes
                </li>
                <li className="flex items-center gap-1.5">
                  <FileText className="size-3 text-blue-500" />
                  Same license (network use)
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Limitations
              </span>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li>• No liability</li>
                <li>• No warranty</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3 font-mono text-[11px] leading-relaxed text-muted-foreground bg-muted/30 p-4 rounded-xl border border-border">
            <p>
              Copyright (c) 2026 Rizky Ramadhan &lt;hello@rizkyramadhan.dev&gt;
            </p>
            <p>
              This program is free software: you can redistribute it and/or modify
              it under the terms of the GNU Affero General Public License as
              published by the Free Software Foundation, either version 3 of the
              License, or (at your option) any later version.
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}
