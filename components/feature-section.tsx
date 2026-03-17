"use client"

import { Lightbulb, MessageSquare, Briefcase, Rocket } from "lucide-react"
import { MatchPreview, WorkspacePreview, PortfolioPreview, BridgePreview } from "@/components/landing/feature-previews"
import { ScrollReveal } from "@/components/scroll-reveal"

const features = [
  {
    name: "The Match",
    tagline: "Find your team. Not a job board.",
    icon: Lightbulb,
    points: ["AI-powered matching by skills and goals", "Browse projects that fit your interests", "Apply in one click"],
    Preview: MatchPreview,
  },
  {
    name: "The Workspace",
    tagline: "Chat, schedule, ship—in one place.",
    icon: MessageSquare,
    points: ["Group chat per project", "Editable schedule with calendar view", "Meeting links and upcoming events in chat"],
    Preview: WorkspacePreview,
  },
  {
    name: "The Portfolio",
    tagline: "Show what you've built.",
    icon: Briefcase,
    points: ["Showcase completed projects", "Get recognition from founders", "Build your reputation"],
    Preview: PortfolioPreview,
  },
  {
    name: "The Bridge",
    tagline: "No financial barriers.",
    icon: Rocket,
    points: ["Zero upfront cost to join", "Equity and partnership options", "Resources and mentorship"],
    Preview: BridgePreview,
  },
]

export function FeatureSection() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <ScrollReveal className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Platform
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Everything you need to connect, collaborate, and create—built for founders and tech creatives.
          </p>
        </ScrollReveal>
        <div className="grid gap-8 md:gap-12 lg:grid-cols-2 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const Preview = feature.Preview
            return (
              <ScrollReveal key={feature.name} delay={index * 80} variant="scale">
                <div className="group rounded-xl border bg-card/50 p-6 md:p-8 shadow-sm hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
                <div className="flex flex-row items-stretch gap-4 sm:gap-6">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="rounded-lg bg-primary/10 p-3 shrink-0 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-3 min-w-0 flex-1">
                      <h3 className="text-xl font-semibold">{feature.name}</h3>
                      <p className="text-muted-foreground font-medium">
                        {feature.tagline}
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {feature.points.map((point, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center justify-center flex-shrink-0 w-32 lg:w-40 xl:w-48">
                    <Preview />
                  </div>
                </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
