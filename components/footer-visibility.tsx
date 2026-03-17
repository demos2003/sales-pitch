"use client"

import Footer from "@/components/footer"
import { RootState } from "@/api/store"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"

export default function FooterVisibility() {
  const [isClient, setIsClient] = useState(false)
  const user = useSelector((state: RootState) => state.auth.user)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Avoid SSR/client mismatch by not rendering anything until mounted on client
  if (!isClient) {
    return null
  }

  const isAuthenticated = !!user
  if (isAuthenticated) {
    return null
  }

  return <Footer />
}
