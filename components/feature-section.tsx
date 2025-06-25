import { Lightbulb, Users, Award, BarChart, Briefcase, Rocket } from "lucide-react"

export function FeatureSection() {
  const features = [
    {
      icon: <Lightbulb className="h-10 w-10 text-primary" />,
      title: "Smart Matching Algorithm",
      description:
        "Our AI matches contributors with projects that align with their skills, interests, and career goals.",
    },
    {
      icon: <Award className="h-10 w-10 text-primary" />,
      title: "Project Showcase",
      description:
        "Completed projects are showcased on the platform, giving contributors recognition and helping founders gain visibility.",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Skill-Building Resources",
      description:
        "Access tutorials, webinars, and mentorship opportunities to help contributors upskill while working on projects.",
    },
    {
      icon: <BarChart className="h-10 w-10 text-primary" />,
      title: "Transparent Collaboration Tools",
      description:
        "Built-in tools for task management, communication, and progress tracking to ensure smooth collaboration.",
    },
    {
      icon: <Briefcase className="h-10 w-10 text-primary" />,
      title: "Equity and Partnership Options",
      description:
        "Guidelines and templates for founders and contributors to negotiate terms like equity or profit-sharing.",
    },
    {
      icon: <Rocket className="h-10 w-10 text-primary" />,
      title: "No Financial Barriers",
      description:
        "Unlike traditional hiring platforms, Sales Pitch removes the financial burden, making it accessible to everyone.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Key Features of Sales Pitch</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform is designed to make collaboration seamless and rewarding for both founders and tech
              creatives.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              {feature.icon}
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-center text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
