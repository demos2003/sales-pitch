"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { useRequestPasswordResetMutation, useResetPasswordMutation } from "@/api/features/auth/authApiSlice"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [step, setStep] = useState<"request" | "reset">("request")

  const [requestPasswordReset, { isLoading: isRequesting }] = useRequestPasswordResetMutation()
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation()

  const handleRequestOtp = async (event: FormEvent) => {
    event.preventDefault()

    try {
      await requestPasswordReset({ email }).unwrap()
      setStep("reset")
      toast({
        title: "OTP sent",
        description: "Check your email for the password reset OTP.",
      })
    } catch (error: any) {
      toast({
        title: "Request failed",
        description: error?.data?.message || "Unable to send OTP.",
        variant: "destructive",
      })
    }
  }

  const handleResetPassword = async (event: FormEvent) => {
    event.preventDefault()

    try {
      await resetPassword({ email, otp, newPassword }).unwrap()
      toast({
        title: "Password reset successful",
        description: "You can now sign in with your new password.",
      })
      router.push("/auth")
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description: error?.data?.message || "Unable to reset password.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            {step === "request"
              ? "Enter your account email to receive a reset OTP."
              : "Enter the OTP from your email and choose a new password."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === "request" ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isRequesting}>
                {isRequesting ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-reset">Email</Label>
                <Input
                  id="email-reset"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isResetting}>
                {isResetting ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Link href="/auth" className="text-sm underline">
            Back to Login
          </Link>
          {step === "reset" && (
            <button
              type="button"
              className="text-sm underline"
              onClick={() => setStep("request")}
            >
              Resend OTP
            </button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
