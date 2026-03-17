"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { HeroAppPreview } from "@/components/landing/hero-app-preview"
import { HeroDoodles } from "@/components/landing/hero-doodles"
import { VALIDATION_WEBSITE } from "@/lib/flags"
import { WaitlistDialog } from "@/components/waitlist-dialog"

export function HeroSection() {
  const [waitlistOpen, setWaitlistOpen] = useState(false)
  return (
    <section className="relative w-full py-16 md:py-24 lg:py-32 xl:py-40 overflow-hidden">
      <HeroDoodles />
      <div className="container relative z-10 px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center space-y-10">
          <div className="space-y-4 animate-fade-in-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary/90 uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/80 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary animate-blink" />
              </span>
              Now Available
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl/none">
              Where Founders Meet Tech <span className="text-primary">Creatives.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl">
              Turn your idea into a product—without being technical. Connect, collaborate, and ship with no upfront cost.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row justify-center items-center animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            {VALIDATION_WEBSITE ? (
              <>
                <Button
                  size="lg"
                  className="px-6 sm:px-7 text-base transition-transform duration-200 hover:scale-105 active:scale-[0.98]"
                  onClick={() => setWaitlistOpen(true)}
                >
                  Join waitlist
                </Button>
                <WaitlistDialog open={waitlistOpen} onOpenChange={setWaitlistOpen} source="hero" />
              </>
            ) : (
              <>
                <Link href="/auth?tab=signup" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:min-w-[200px] text-base transition-transform duration-200 hover:scale-105 active:scale-[0.98]"
                  >
                    Get Started
                  </Button>
                </Link>
                <Link href="/auth" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:min-w-[200px] text-base transition-transform duration-200 hover:scale-105 active:scale-[0.98]"
                  >
                    Log in
                  </Button>
                </Link>
              </>
            )}
          </div>
          <p className="text-sm text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Trusted by founders and tech creatives building the next big thing
          </p>
        </div>
        {/* App preview graphic */}
        <div className="mt-12 md:mt-16 animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
          <HeroAppPreview />
        </div>
      </div>
    </section>
  )
}
