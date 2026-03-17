"use client"

import { LayoutDashboard, FolderKanban, MessageSquare, Calendar } from "lucide-react"

export function HeroAppPreview() {
  return (
    <div className="relative mx-auto max-w-3xl">
      {/* Browser chrome */}
      <div className="rounded-lg border bg-card/80 shadow-2xl shadow-primary/10 overflow-hidden animate-float">
        <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="rounded-md bg-background/60 px-4 py-1.5 text-xs text-muted-foreground w-2/3 text-center">
              app.panmae.com/dashboard
            </div>
          </div>
        </div>
        <div className="flex min-h-[280px] md:min-h-[320px]">
          {/* Sidebar mock */}
          <div className="w-16 md:w-20 border-r bg-muted/30 py-3 flex flex-col items-center gap-4">
            <div className="rounded-lg bg-primary/20 p-2">
              <LayoutDashboard className="h-5 w-5 text-primary" />
            </div>
            <div className="rounded-lg p-2 text-muted-foreground hover:text-foreground transition-colors">
              <FolderKanban className="h-5 w-5" />
            </div>
            <div className="rounded-lg p-2 text-muted-foreground hover:text-foreground transition-colors">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div className="rounded-lg p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          {/* Main content mock */}
          <div className="flex-1 p-4 md:p-6 space-y-4">
            <div className="space-y-1">
              <div className="h-5 w-32 rounded bg-muted-foreground/20" />
              <div className="h-3 w-48 rounded bg-muted-foreground/10" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              {["Active", "Applications", "Messages", "Projects"].map((label, i) => (
                <div
                  key={label}
                  className="rounded-lg border bg-background/60 p-3 hover:border-primary/30 transition-colors"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="h-3 w-12 rounded bg-muted-foreground/10 mb-2" />
                  <div className="h-6 w-8 rounded bg-primary/20" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="rounded-lg border bg-background/40 p-3 space-y-2">
                <div className="h-3 w-24 rounded bg-muted-foreground/10" />
                <div className="h-2 w-full rounded bg-muted-foreground/5" />
                <div className="h-2 w-4/5 rounded bg-muted-foreground/5" />
              </div>
              <div className="rounded-lg border bg-background/40 p-3 space-y-2">
                <div className="h-3 w-20 rounded bg-muted-foreground/10" />
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/20" />
                  <div className="flex-1 space-y-1">
                    <div className="h-2 w-full rounded bg-muted-foreground/5" />
                    <div className="h-2 w-2/3 rounded bg-muted-foreground/5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Glow behind */}
      <div className="absolute -inset-4 bg-gradient-to-b from-primary/20 to-transparent rounded-2xl blur-2xl -z-10 animate-glow-pulse" />
    </div>
  )
}
