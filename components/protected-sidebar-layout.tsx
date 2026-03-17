"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, FolderKanban, MessageSquare, MessagesSquare, User, Settings, Menu } from "lucide-react"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Chat", href: "/chat", icon: MessageSquare },
  { name: "Applications", href: "/applications", icon: MessagesSquare },
  { name: "Settings", href: "/profile/settings", icon: Settings },
]

function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

        return (
          <Link key={item.name} href={item.href}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.name}
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}

export default function ProtectedSidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <aside className="hidden md:block w-64 border-r bg-background sticky top-16 h-[calc(100vh-4rem)] shrink-0 overflow-y-auto">
        <SidebarNav />
      </aside>

      <div className="flex-1 min-w-0 h-full overflow-y-auto">
        <div className="md:hidden border-b p-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open sidebar">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <SidebarNav />
            </SheetContent>
          </Sheet>
        </div>

        <div className="p-4 md:p-6">{children}</div>
      </div>
    </div>
  )
}
