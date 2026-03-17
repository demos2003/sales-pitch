"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface WaitlistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  source?: string
}

export function WaitlistDialog({ open, onOpenChange, source }: WaitlistDialogProps) {
  const [submitting, setSubmitting] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join the Panmae waitlist</DialogTitle>
          <DialogDescription>
            Be the first to know when we open up more workspaces for founders and tech creatives.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4 mt-4"
          action="https://formspree.io/f/mayvkkjg"
          method="POST"
          onSubmit={() => setSubmitting(true)}
        >
          {source && <input type="hidden" name="source" value={source} />}
          <div className="space-y-1">
            <label htmlFor="waitlist-email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="waitlist-email"
              name="email"
              type="email"
              required
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="waitlist-role" className="text-sm font-medium">
              I&apos;m a
            </label>
            <select
              id="waitlist-role"
              name="role"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              defaultValue="founder"
            >
              <option value="founder">Founder</option>
              <option value="creative">Tech creative</option>
              <option value="other">Other</option>
            </select>
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Submitting..." : "Join waitlist"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            We&apos;ll only use your email to send product updates and launch invites. No spam.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}

