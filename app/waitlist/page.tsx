import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function WaitlistPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md w-full rounded-2xl border bg-card/60 px-6 py-8 shadow-lg space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Join the Panmae waitlist</h1>
          <p className="text-sm text-muted-foreground">
            Be the first to know when we open up more workspaces for founders and tech creatives.
          </p>
        </div>
        <form
          className="space-y-4"
          action="https://formspree.io/f/xojkpnlk"
          method="POST"
        >
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="role" className="text-sm font-medium">
              I&apos;m a
            </label>
            <select
              id="role"
              name="role"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              defaultValue="founder"
            >
              <option value="founder">Founder</option>
              <option value="creative">Tech creative</option>
              <option value="other">Other</option>
            </select>
          </div>
          <Button type="submit" className="w-full">
            Join waitlist
          </Button>
        </form>
        <p className="text-xs text-muted-foreground text-center">
          We&apos;ll only use your email to send product updates and launch invites. No spam.
        </p>
        <p className="text-xs text-muted-foreground text-center">
          Ready to explore anyway?{" "}
          <Link href="/" className="text-primary hover:underline">
            Go back to the landing page
          </Link>
        </p>
      </div>
    </main>
  )
}

