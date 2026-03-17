"use client"

import { useEffect, useRef, type ReactNode } from "react"

type ScrollRevealProps = {
  children: ReactNode
  className?: string
  variant?: "up" | "scale"
  delay?: number
  rootMargin?: string
  once?: boolean
}

export function ScrollReveal({
  children,
  className = "",
  variant = "up",
  delay = 0,
  rootMargin = "0px 0px -48px 0px",
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const target = entry.target as HTMLElement
          if (delay > 0) {
            const t = setTimeout(() => {
              target.classList.add("scroll-reveal-visible")
              if (once) observer.unobserve(target)
            }, delay)
            return () => clearTimeout(t)
          }
          target.classList.add("scroll-reveal-visible")
          if (once) observer.unobserve(target)
        })
      },
      { rootMargin, threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin, once, delay])

  const baseClass = variant === "scale" ? "scroll-reveal-scale" : "scroll-reveal"
  return (
    <div ref={ref} className={`${baseClass} ${className}`}>
      {children}
    </div>
  )
}
