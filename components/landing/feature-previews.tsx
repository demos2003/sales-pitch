"use client"

export function MatchPreview() {
  return (
    <div className="rounded-lg border bg-card/60 p-3 space-y-2 shadow-lg hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <div className="h-2.5 w-20 rounded bg-muted-foreground/20" />
        <div className="h-5 w-14 rounded-full bg-primary/20 text-[10px] flex items-center justify-center text-primary font-medium">
          Open
        </div>
      </div>
      <div className="h-2 w-full rounded bg-muted-foreground/10" />
      <div className="flex gap-1.5 flex-wrap">
        {["React", "Node", "Design"].map((t) => (
          <span key={t} className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] text-primary">
            {t}
          </span>
        ))}
      </div>
      <div className="h-2 w-16 rounded bg-muted-foreground/5 text-[10px]" />
    </div>
  )
}

export function WorkspacePreview() {
  return (
    <div className="rounded-2xl border bg-card/70 px-4 py-5 space-y-3 shadow-lg hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl bg-primary/25 flex-shrink-0" />
          <div className="space-y-1">
            <div className="h-2 w-16 rounded bg-muted-foreground/20" />
            <div className="h-1.5 w-10 rounded bg-muted-foreground/15" />
          </div>
        </div>
        <div className="h-6 px-2 rounded-full bg-emerald-500/10 text-[10px] flex items-center justify-center text-emerald-300">
          Online
        </div>
      </div>
      <div className="rounded-xl bg-background/40 p-3 space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-2 w-12 rounded-full bg-muted-foreground/20" />
          <div className="h-2 w-16 rounded-full bg-primary/30" />
        </div>
        <div className="h-1.5 w-24 rounded-full bg-muted-foreground/15" />
        <div className="flex items-center gap-2 pt-1">
          <div className="h-6 flex-1 rounded-full bg-primary/15" />
          <div className="h-6 w-6 rounded-lg bg-primary/25" />
        </div>
      </div>
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>Next: standup · 10:00</span>
        </div>
        <div className="h-6 w-6 rounded-md bg-primary/20" />
      </div>
    </div>
  )
}

export function PortfolioPreview() {
  return (
    <div className="rounded-lg border bg-card/60 p-3 space-y-2 shadow-lg hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-primary/30 flex items-center justify-center text-xs font-bold text-primary">
          AJ
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="h-2.5 w-24 rounded bg-muted-foreground/20" />
          <div className="h-2 w-16 rounded bg-muted-foreground/10" />
        </div>
      </div>
      <div className="rounded bg-muted/50 h-12 flex items-center justify-center">
        <span className="text-[10px] text-muted-foreground">Project showcase</span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-1.5 flex-1 rounded-full bg-primary/20" />
        ))}
      </div>
    </div>
  )
}

export function BridgePreview() {
  return (
    <div className="rounded-lg border bg-card/60 p-3 space-y-2 shadow-lg hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
          ✓
        </div>
        <div className="h-2 w-28 rounded bg-muted-foreground/15" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
          ✓
        </div>
        <div className="h-2 w-24 rounded bg-muted-foreground/15" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
          ✓
        </div>
        <div className="h-2 w-32 rounded bg-muted-foreground/15" />
      </div>
      <div className="pt-1">
        <div className="h-6 w-full rounded bg-primary/20 text-[10px] flex items-center justify-center text-primary font-medium">
          $0 to start
        </div>
      </div>
    </div>
  )
}
