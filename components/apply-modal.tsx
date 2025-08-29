
"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (role: string, message: string) => Promise<void>;
  rolesNeeded: { skill: string; count: number }[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  reset: () => void;
}

export function ApplyModal({ isOpen, onClose, onSubmit, rolesNeeded, isLoading, isSuccess, isError, reset }: ApplyModalProps) {
  const [message, setMessage] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [showStatusMessage, setShowStatusMessage] = useState(false);

  useEffect(() => {
    if (isSuccess || isError) {
      setShowStatusMessage(true);
      const timer = setTimeout(() => {
        setShowStatusMessage(false);
        onClose();
        reset();
      }, 2000); // Show message for 2 seconds then close
      return () => clearTimeout(timer);
    }
  }, [isSuccess, isError, onClose, reset]);

  const handleLocalClose = () => {
    setMessage("");
    setSelectedRole("");
    setShowStatusMessage(false);
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    await onSubmit(selectedRole, message);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleLocalClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Apply to Project</DialogTitle>
          <DialogDescription>
            Select a role and write a message to the project founder. The message is optional.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {showStatusMessage ? (
            <div className={`text-center py-4 ${isSuccess ? "text-green-500" : "text-red-500"}`}>
              {isSuccess ? "Application submitted successfully!" : "Failed to submit application."}
            </div>
          ) : (
            <>
              <div className="grid gap-2">
                <Label htmlFor="role-select">
                  Role you are applying for
                </Label>
                <Select onValueChange={setSelectedRole} value={selectedRole} disabled={isLoading}>
                  <SelectTrigger id="role-select">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {rolesNeeded.map((role) => (
                      <SelectItem key={role.skill} value={role.skill}>
                        {role.skill} ({role.count} open)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">
                  Your Message (Optional)
                </Label>
                <Textarea
                  id="message"
                  placeholder="I'm interested in this project because..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="h-32"
                  disabled={isLoading}
                />
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleLocalClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!selectedRole || isLoading} variant="accent">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
