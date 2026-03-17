"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { VALIDATION_WEBSITE } from "@/lib/flags"

export function TestimonialsSection() {
  if (VALIDATION_WEBSITE) {
    return null
  }

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Founder, TechStart",
      avatar: "AJ",
      content:
        "Panmae helped me find an amazing team of developers and designers who brought my app idea to life. I couldn't have afforded to hire this caliber of talent otherwise.",
    },
    {
      name: "Sarah Chen",
      role: "UX Designer",
      avatar: "SC",
      content:
        "As a junior designer, I was struggling to build my portfolio. Through Panmae, I've worked on three real-world projects that have significantly improved my skills and resume.",
    },
    {
      name: "Michael Rodriguez",
      role: "Full Stack Developer",
      avatar: "MR",
      content:
        "The platform connected me with a startup founder whose vision aligned perfectly with my interests. We've been working together for 6 months now, and I've even received equity in the company.",
    },
    {
      name: "Emily Taylor",
      role: "Founder, EcoTrack",
      avatar: "ET",
      content:
        "I had a vision for an environmental impact app but no technical skills. Panmae connected me with passionate developers who shared my mission, and we launched in just 3 months.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <ScrollReveal className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Success Stories</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Hear from founders and contributors who have found success on our platform.
            </p>
          </div>
        </ScrollReveal>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={index} delay={index * 60} variant="scale">
              <Card className="group border shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/20">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar className="h-12 w-12 transition-transform duration-300 group-hover:scale-105 ring-2 ring-background">
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                    {testimonial.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">&quot;{testimonial.content}&quot;</p>
              </CardContent>
            </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
