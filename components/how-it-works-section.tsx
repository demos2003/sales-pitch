export function HowItWorksSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">How Sales Pitch Works</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              The platform is designed to be simple, intuitive, and effective for both founders and contributors.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-2">
          <div className="space-y-8">
            <h3 className="text-2xl font-bold">For Founders</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-medium">Create a Compelling Pitch</h4>
                  <p className="text-muted-foreground">Outline your idea, goals, and the skills or roles you need.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  2
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-medium">Specify Project Type</h4>
                  <p className="text-muted-foreground">
                    Define if it's a pet project, startup, or open-source initiative.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  3
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-medium">Include Details</h4>
                  <p className="text-muted-foreground">
                    Add timelines, desired outcomes, and potential long-term opportunities.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  4
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-medium">Review Applications</h4>
                  <p className="text-muted-foreground">Select the team that best aligns with your vision.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <h3 className="text-2xl font-bold">For Contributors</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-medium">Browse Projects</h4>
                  <p className="text-muted-foreground">Explore curated pitches based on your interests and skills.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  2
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-medium">Apply to Projects</h4>
                  <p className="text-muted-foreground">
                    Join projects that excite you and align with your growth objectives.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  3
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-medium">Collaborate</h4>
                  <p className="text-muted-foreground">Work with a diverse team and gain hands-on experience.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  4
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-medium">Build Your Portfolio</h4>
                  <p className="text-muted-foreground">Showcase your work and grow your professional network.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
