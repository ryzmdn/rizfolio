import { Container } from "@workspace/ui/components/layouts"
import { Mail, ArrowUpRight, ShieldCheck, MapPin } from "lucide-react"
import { personalInfo } from "@/data"
import { InquiryDialog } from "./inquiry-dialog"

export function CtaSection() {
  return (
    <Container id="call-to-action" className="py-24 md:py-36">
      <div className="relative overflow-hidden rounded-3xl border border-foreground/15 bg-foreground/[0.02] p-8 sm:p-14 lg:p-20">
        <div className="relative z-10 space-y-12">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-foreground/8 pb-6">
            <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
              <ShieldCheck className="size-3.5 text-foreground" />
              <span>DIRECT EXECUTIVE CHANNEL</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs tracking-wider text-muted-foreground">
              <MapPin className="size-3 text-muted-foreground" />
              <span>JAKARTA / GLOBAL EDGE</span>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-light tracking-[-0.03em] text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              Initiate an architectural engagement.
            </h2>
            <p className="max-w-2xl text-base leading-relaxed font-light text-muted-foreground sm:text-lg">
              Available for strategic system design, high-concurrency
              architecture advisory, and dedicated enterprise engineering
              contracts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <InquiryDialog />
          </div>

          <div className="grid grid-cols-1 gap-6 border-t border-foreground/8 pt-10 sm:grid-cols-2 lg:grid-cols-3">
            {personalInfo.contactEmails.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  {item.label}
                </span>
                <a
                  href={`mailto:${item.email}`}
                  className="group flex items-center gap-2 font-mono text-sm text-foreground hover:underline"
                >
                  <span>{item.email}</span>
                  <ArrowUpRight className="size-3 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            ))}

            <div className="space-y-1.5">
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                CONTRACT AVAILABILITY
              </span>
              <p className="font-mono text-sm text-foreground">
                Q2 / Q3 2026 Commitments
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
