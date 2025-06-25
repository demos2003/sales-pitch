import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Connect Founders with Tech Creatives
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Sales Pitch is a revolutionary platform designed to bridge the gap between visionary founders and the
                talented individuals they need to turn ideas into reality—all at no cost.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/auth?role=founder">
                <Button size="lg" className="w-full">
                  Join as a Founder
                </Button>
              </Link>
              <Link href="/auth?role=creative">
                <Button size="lg" variant="outline" className="w-full">
                  Join as a Tech Creative
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[450px] w-full overflow-hidden rounded-xl bg-muted">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-muted-foreground/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="space-y-2 text-center">
                    <div className="inline-block rounded-lg bg-background/90 px-3 py-1 text-sm backdrop-blur-sm">
                      Join 5,000+ users already on the platform
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
