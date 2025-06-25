import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Join the Movement</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Whether you're a founder with a groundbreaking idea or a contributor looking to make an impact, Sales
              Pitch is your platform to connect, collaborate, and create.
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
      </div>
    </section>
  )
}
