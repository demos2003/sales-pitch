"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/scroll-reveal"
import { VALIDATION_WEBSITE } from "@/lib/flags"
import { WaitlistDialog } from "@/components/waitlist-dialog"

export function CTASection() {
  const [waitlistOpen, setWaitlistOpen] = useState(false)
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Subtle gradient orb */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="h-[400px] w-[400px] rounded-full bg-primary/10 blur-[100px] animate-glow-pulse" />
      </div>
      <div className="container relative px-4 md:px-6">
        <ScrollReveal className="mx-auto max-w-2xl text-center space-y-8" variant="scale">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              {VALIDATION_WEBSITE ? "Get early access" : "Join Panmae"}
            </h2>
            <p className="text-muted-foreground text-lg">
              {VALIDATION_WEBSITE
                ? "We’re validating Panmae with a small group first. Join the waitlist to be part of the first cohort."
                : "Whether you&apos;re a founder with an idea or a creative ready to build—connect, collaborate, and create. Start free."}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row justify-center items-center">
            {VALIDATION_WEBSITE ? (
              <>
                <Button
                  size="lg"
                  className="w-full sm:min-w-[220px] text-base transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
                  onClick={() => setWaitlistOpen(true)}
                >
                  Join the waitlist
                </Button>
                <WaitlistDialog open={waitlistOpen} onOpenChange={setWaitlistOpen} source="cta" />
              </>
            ) : (
              <>
                <Link href="/auth?tab=signup&role=founder" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:min-w-[200px] text-base transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
                  >
                    Join as a Founder
                  </Button>
                </Link>
                <Link href="/auth?tab=signup&role=creative" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:min-w-[200px] text-base transition-all duration-200 hover:scale-105 active:scale-[0.98]"
                  >
                    Join as a Tech Creative
                  </Button>
                </Link>
              </>
            )}
          </div>
          {!VALIDATION_WEBSITE && (
            <p className="text-sm text-muted-foreground">
              Free to join. No credit card required.
            </p>
          )}
        </ScrollReveal>
      </div>
    </section>
  )
}
