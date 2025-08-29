import { Loader2 } from "lucide-react"

export default function ChatLoading() {
  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">
          Chat with project founders and team members
        </p>
      </div>

      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    </div>
  )
} 