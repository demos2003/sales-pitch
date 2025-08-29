"use client";

import type React from "react"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import AuthLayout from "@/components/auth-layout"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthLayout>
      <Suspense
        fallback={
          <div className="flex h-[80vh] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        {children}
      </Suspense>
    </AuthLayout>
  )
}
