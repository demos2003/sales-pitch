
"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut, Settings } from "lucide-react"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDispatch, useSelector } from "react-redux"
import SessionStatus from "@/components/session-status"
import { logout } from "@/api/features/auth/authSlice"
import { RootState } from "@/api/store"
import { VALIDATION_WEBSITE } from "@/lib/flags"
import { WaitlistDialog } from "@/components/waitlist-dialog"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [waitlistOpen, setWaitlistOpen] = useState(false)
  const pathname = usePathname()
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth.user)

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  const publicNavigation = [
    { name: "Home", href: "/" },
    { name: "For Founders", href: "/for-founders" },
    { name: "For Creatives", href: "/for-creatives" },
    { name: "About", href: "/about" },
  ]

  const isFounder = user?.role === "founder"
  const isAuthenticated = isClient && !!user
  const navigation = VALIDATION_WEBSITE ? [] : publicNavigation

  const handleLogout = () => {
    dispatch(logout())
    window.location.href = "/auth"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={isClient && user ? "/dashboard" : "/"} className="flex items-center">
            <Image src="/Panmae2.png" alt="Panmae logo" width={70} height={70} />
            <span className="text-xl font-bold">Panmae</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        {!isAuthenticated && (
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        )}

        <div className="hidden md:flex items-center gap-4">
       
          {isClient && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user.avatar || user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile/settings">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : VALIDATION_WEBSITE ? (
            <>
              <Button size="sm" onClick={() => setWaitlistOpen(true)}>
                Join waitlist
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth">
                <Button variant="outline" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/auth?tab=signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && !isAuthenticated && (
        <div className="md:hidden border-t">
          <div className="container py-4 flex flex-col space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {isClient && user ? (
              <>
                <Link href="/profile/settings" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full flex items-center justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-start"
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </>
            ) : VALIDATION_WEBSITE ? (
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Button
                  className="w-full"
                  onClick={() => {
                    setWaitlistOpen(true)
                    setIsMenuOpen(false)
                  }}
                >
                  Join waitlist
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link href="/auth?tab=signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      {VALIDATION_WEBSITE && (
        <WaitlistDialog open={waitlistOpen} onOpenChange={setWaitlistOpen} source="header" />
      )}
    </header>
  )
}
