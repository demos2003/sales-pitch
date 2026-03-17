"use client"

import { ScrollReveal } from "@/components/scroll-reveal"

export function HowItWorksSection() {
  const founderSteps = [
    "Create a compelling pitch—idea, goals, and roles you need.",
    "Set project type and timeline.",
    "Review applications and pick your team.",
    "Collaborate in the workspace; track progress.",
  ]
  const creativeSteps = [
    "Browse projects that match your skills and interests.",
    "Apply with one click—no lengthy forms.",
    "Collaborate with the team; build in the workspace.",
    "Showcase your work and grow your portfolio.",
  ]

  return (
    <section className="w-full py-16 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <ScrollReveal className="text-center space-y-4 mb-14">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            How it works
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Simple, intuitive, and built for both founders and contributors.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={80} className="mx-auto max-w-md flex justify-center gap-4 mb-12">
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-xl border-2 border-primary/30 bg-primary/5 px-6 py-3 text-sm font-medium text-primary transition-transform duration-200 hover:scale-105">
              Founder
            </div>
            <div className="h-8 w-0.5 bg-gradient-to-b from-primary/40 to-transparent" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full h-12 w-12 border-2 border-primary/40 flex items-center justify-center text-primary font-bold text-sm">
              ↔
            </div>
            <p className="text-xs text-muted-foreground">Match &amp; collaborate</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-xl border-2 border-primary/30 bg-primary/5 px-6 py-3 text-sm font-medium text-primary transition-transform duration-200 hover:scale-105">
              Creative
            </div>
            <div className="h-8 w-0.5 bg-gradient-to-b from-primary/40 to-transparent" />
          </div>
        </ScrollReveal>
        <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-2">
          <ScrollReveal delay={120} className="space-y-6">
            <h3 className="text-lg font-semibold text-primary">For Founders</h3>
            <ol className="space-y-4">
              {founderSteps.map((step, i) => (
                <li
                  key={i}
                  className="flex gap-3 rounded-lg p-3 -mx-3 transition-colors duration-200 hover:bg-muted/50"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-medium text-primary transition-transform duration-200 hover:scale-110">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </ScrollReveal>
          <ScrollReveal delay={180} className="space-y-6">
            <h3 className="text-lg font-semibold text-primary">For Tech Creatives</h3>
            <ol className="space-y-4">
              {creativeSteps.map((step, i) => (
                <li
                  key={i}
                  className="flex gap-3 rounded-lg p-3 -mx-3 transition-colors duration-200 hover:bg-muted/50"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-medium text-primary transition-transform duration-200 hover:scale-110">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
