"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { ArrowLeft, Shield, Smartphone, Mail, Loader2, Eye, EyeOff } from "lucide-react"
import { useLoginMutation, useSignUpMutation } from "@/api/features/auth/authApiSlice"
import { useDispatch } from "react-redux"
import { setCredentials } from "@/api/features/auth/authSlice"
import { useVerifyOtpMutation } from "@/api/features/auth/authApiSlice"


export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = "/dashboard"
  const roleParam = searchParams.get("role")
  const tabParam = searchParams.get("tab")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [primaryRole, setPrimaryRole] = useState("developer")
  const [activeTab, setActiveTab] = useState<string>(tabParam === "signup" ? "signup" : "login")
  const [role, setRole] = useState<string>(roleParam === "creative" ? "creative" : "founder")
  const [loginRole, setLoginRole] = useState<string>(roleParam === "creative" ? "creative" : "founder")
  const [authStep, setAuthStep] = useState<"credentials" | "2fa">("credentials")
  const [resendCooldown, setResendCooldown] = useState(0)
  const [tempAuthData, setTempAuthData] = useState<any>(null)
  const [verifyOtp] = useVerifyOtpMutation()

  // Add OTP-related state
  const [otp, setOtp] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  // Add loading states
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isSigningUp, setIsSigningUp] = useState(false)

  // Add password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)

  // Add form errors
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string; general?: string }>({})
  const [signupErrors, setSignupErrors] = useState<{ name?: string; email?: string; password?: string; general?: string }>({})

  const dispatch = useDispatch()
  const [login] = useLoginMutation()
  const [signUp] = useSignUpMutation()

  // Validation functions
  const validateLoginForm = () => {
    const errors: { email?: string; password?: string } = {}
    
    if (!email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address"
    }
    
    if (!password.trim()) {
      errors.password = "Password is required"
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }
    
    setLoginErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateSignupForm = () => {
    const errors: { name?: string; email?: string; password?: string } = {}
    
    if (!name.trim()) {
      errors.name = "Full name is required"
    }
    
    if (!email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address"
    }
    
    if (!password.trim()) {
      errors.password = "Password is required"
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }
    
    setSignupErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Mock 2FA verification - automatically succeeds after 1.5 seconds
const verify2FA = async (otpValue: string) => {
  setIsVerifying(true)

  try {
    const response = await verifyOtp({ email: tempAuthData.email, otp: otpValue }).unwrap()

    if (response?.token && response?.user) {
      dispatch(setCredentials({ user: response.user, token: response.token }))
      localStorage.setItem("user", JSON.stringify(response.user))
      localStorage.setItem("token", response.token)

      toast({
        title: "Login successful",
        description: `Welcome back, ${response.user.name}`,
      })

      setTimeout(() => window.location.href = "/dashboard", 1000)
    } else {
      throw new Error("Unexpected response from server.")
    }
  } catch (error: any) {
    toast({
      title: "Verification failed",
      description: error?.data?.message || "Invalid verification code. Please try again.",
      variant: "destructive",
    })
    setOtp("") // Clear OTP
  } finally {
    setIsVerifying(false)
  }
}


  // Handle OTP completion
  const handleOTPComplete = (value: string) => {
    setOtp(value)
    if (value.length === 6) {
      verify2FA(value)
    }
  }

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  
  // Clear previous errors
  setLoginErrors({})
  
  // Validate form
  if (!validateLoginForm()) {
    return
  }

  setIsLoggingIn(true)

  try {
    const response = await login({ email, password }).unwrap()

    if (response?.message === "OTP sent. Please verify to complete login.") {
      // Show 2FA screen
      setAuthStep("2fa")
      setTempAuthData({ email }) // Store email to verify OTP later

      toast({
        title: "OTP Sent",
        description: "Please enter the 6-digit code sent to your email.",
      })

      return
    }

    // If response includes token and user, proceed to login
    if (response.token && response.user) {
      dispatch(setCredentials({ user: response.user, token: response.token }))
      localStorage.setItem("user", JSON.stringify(response.user))
      localStorage.setItem("token", response.token)

      toast({
        title: "Login successful",
        description: `Welcome back, ${response.user.name}`,
      })

      setTimeout(() => window.location.href = "/dashboard", 1000)
    } else {
      throw new Error("Unexpected response format")
    }
  } catch (err: any) {
    const errorMessage = err?.data?.message || "Something went wrong"
    setLoginErrors({ general: errorMessage })
    toast({
      title: "Login failed",
      description: errorMessage,
      variant: "destructive",
    })
  } finally {
    setIsLoggingIn(false)
  }
}


  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors
    setSignupErrors({})
    
    // Validate form
    if (!validateSignupForm()) {
      return
    }
    
    setIsSigningUp(true)
    const backendRole = role === "creative" ? "contributor" : "founder"

    try {
      const response = await signUp({
        name,
        email,
        password,
        role: backendRole,
        primaryRole,
      }).unwrap()

      dispatch(setCredentials({ user: response.user, token: response.token }))
      localStorage.setItem("user", JSON.stringify(response.user))
      localStorage.setItem("token", response.token)

      toast({
        title: "Account created successfully",
        description: `Welcome ${response.user.name}!`,
      })

      setTimeout(() => router.push("/dashboard"), 1000)
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Something went wrong"
      setSignupErrors({ general: errorMessage })
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSigningUp(false)
    }
  }

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return

    setResendCooldown(30)
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    toast({
      title: "OTP Resent",
      description: "A new verification code has been sent to your authenticator app.",
    })
  }

  const goBackToCredentials = () => {
    setAuthStep("credentials")
    setTempAuthData(null)
    setOtp("") // Clear OTP when going back
    setIsVerifying(false)
  }

  return (
    <div className="container flex items-center justify-center py-10 md:py-20">
      <Card className="w-full max-w-md">
        {authStep === "credentials" ? (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Welcome to Sales Pitch</CardTitle>
              <CardDescription>
                Join our community of founders and tech creatives to build amazing products together.
              </CardDescription>
            </CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Log in</TabsTrigger>
                <TabsTrigger value="signup">Sign up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={loginErrors.email ? "border-red-500" : ""}
                      />
                      {loginErrors.email && <p className="text-red-500 text-xs mt-1">{loginErrors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link
                          href="/forgot-password"
                          className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showLoginPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`pr-10 ${loginErrors.password ? "border-red-500" : ""}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                        >
                          {showLoginPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                      {loginErrors.password && <p className="text-red-500 text-xs mt-1">{loginErrors.password}</p>}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <Label htmlFor="remember">Remember me</Label>
                    </div>
                    {loginErrors.general && <p className="text-red-500 text-xs mt-2">{loginErrors.general}</p>}
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full" disabled={isLoggingIn}>
                      {isLoggingIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Log in "}
                    </Button>
                    <div className="text-center text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setActiveTab("signup")}
                        className="underline underline-offset-4 hover:text-primary"
                      >
                        Sign up
                      </button>
                    </div>
                  </CardFooter>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSignup}>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>I am a:</Label>
                      <RadioGroup value={role} onValueChange={setRole} className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="founder" id="founder" />
                          <Label htmlFor="founder">Founder</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="creative" id="creative" />
                          <Label htmlFor="creative">Tech Creative</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={signupErrors.name ? "border-red-500" : ""}
                      />
                      {signupErrors.name && <p className="text-red-500 text-xs mt-1">{signupErrors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="john@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={signupErrors.email ? "border-red-500" : ""}
                      />
                      {signupErrors.email && <p className="text-red-500 text-xs mt-1">{signupErrors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showSignupPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`pr-10 ${signupErrors.password ? "border-red-500" : ""}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                        >
                          {showSignupPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                      {signupErrors.password && <p className="text-red-500 text-xs mt-1">{signupErrors.password}</p>}
                    </div>

                    {role === "founder" && (
                      <div className="space-y-2">
                        <Label>What best describes you?</Label>
                        <RadioGroup defaultValue="startup">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="startup" id="startup" />
                            <Label htmlFor="startup">Startup Founder</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="idea" id="idea" />
                            <Label htmlFor="idea">I have an idea</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="established" id="established" />
                            <Label htmlFor="established">Established Business</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    )}

                    {role === "creative" && (
                      <div className="space-y-2">
                        <Label>What's your primary role?</Label>
                        <RadioGroup value={primaryRole} onValueChange={setPrimaryRole}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="developer" id="developer" />
                            <Label htmlFor="developer">Developer</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="designer" id="designer" />
                            <Label htmlFor="designer">Designer</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="product_manager" id="product_manager" />
                            <Label htmlFor="product_manager">Product Manager</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="other" />
                            <Label htmlFor="other">Other</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" required />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the{" "}
                        <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                    {signupErrors.general && <p className="text-red-500 text-xs mt-2">{signupErrors.general}</p>}
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full" disabled={isSigningUp}>
                      {isSigningUp ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create "}
                      {role === "creative" ? "Tech Creative" : "Founder"} Account
                    </Button>
                    <div className="text-center text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setActiveTab("login")}
                        className="underline underline-offset-4 hover:text-primary"
                      >
                        Log in
                      </button>
                    </div>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <>
            <CardHeader>
              <div className="flex items-center space-x-2 mb-2">
                <Button variant="ghost" size="icon" onClick={goBackToCredentials}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Two-Factor Authentication</CardTitle>
                </div>
              </div>
              <CardDescription>
                Enter the 6-digit verification code from your authenticator app to complete your login.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Smartphone className="h-4 w-4" />
                  <span>Check your authenticator app</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Logging in as: <span className="font-medium">{email}</span>
                </p>
              </div>

              <div className="space-y-4">
                <Label htmlFor="otp" className="text-center block">
                  Verification Code
                </Label>
                <div className="flex items-center justify-center ">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    onComplete={handleOTPComplete}
                    disabled={isVerifying}
                    autoFocus
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

              </div>

              {/* Optional: Manual verify button */}
              <Button
                onClick={() => verify2FA(otp)}
                disabled={otp.length !== 6 || isVerifying}
                className="w-full"
                variant="outline"
              >
                {isVerifying ? "Verifying..." : "Verify Code"}
              </Button>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Didn't receive a code?</p>
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleResendOTP}
                  disabled={resendCooldown > 0}
                  className="h-auto p-0"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="w-full space-y-2">
                <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span>Having trouble? Contact support</span>
                </div>
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}