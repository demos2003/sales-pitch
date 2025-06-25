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
import { useLoginMutation, useSignUpMutation } from "@/api/features/auth/authApiSlice"
import { useDispatch } from "react-redux"
import { setCredentials } from "@/api/features/auth/authSlice"

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl =  "/dashboard"
  const roleParam = searchParams.get("role")
  const tabParam = searchParams.get("tab")

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [primaryRole, setPrimaryRole] = useState("developer");
  const [activeTab, setActiveTab] = useState<string>(tabParam === "signup" ? "signup" : "login")
  const [role, setRole] = useState<string>(roleParam === "creative" ? "creative" : "founder")
  const [loginRole, setLoginRole] = useState<string>(roleParam === "creative" ? "creative" : "founder")
  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  const [signUp] = useSignUpMutation();

  // Mock login function - in a real app, this would call your auth API
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({ email, password }).unwrap();

      dispatch(setCredentials({ user: response.user, token: response.token }));
         // Fix: Stringify the user object before storing
    localStorage.setItem("user", JSON.stringify(response.user));
    localStorage.setItem("token", response.token);

      toast({
        title: "Login successful",
        description: `Welcome back, ${response.user.name}`,
      });

      router.push("/dashboard")
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };


  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const backendRole = role === "creative" ? "contributor" : "founder";

    try {
      const response = await signUp({
        name,
        email,
        password,
        role: backendRole,
        primaryRole,
      }).unwrap();

      dispatch(setCredentials({ user: response.user, token: response.token }));
      localStorage.setItem("token", response.token);

      toast({
        title: "Account created successfully",
        description: `Welcome ${response.user.name}!`,
      });

      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (err: any) {
      toast({
        title: "Signup failed",
        description: err?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };





  return (
    <div className="container flex items-center justify-center py-10 md:py-20">
      <Card className="w-full max-w-md">
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
                  <Label>I am a:</Label>
                  <RadioGroup value={loginRole} onValueChange={setLoginRole} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="founder" id="login-founder" />
                      <Label htmlFor="login-founder">Founder</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="creative" id="login-creative" />
                      <Label htmlFor="login-creative">Tech Creative</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="name@example.com" required value={email}
                    onChange={(e) => setEmail(e.target.value)} />
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
                  <Input id="password" type="password" required value={password}
                    onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember">Remember me</Label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full">
                  Log in as {loginRole === "creative" ? "Tech Creative" : "Founder"}
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
                  <Input id="name" placeholder="John Doe" required value={name}
                    onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" placeholder="john@example.com" required value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" required value={password}
                    onChange={(e) => setPassword(e.target.value)} />
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
                        <RadioGroupItem value="pm" id="pm" />
                        <Label htmlFor="pm">Product Manager</Label>
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
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full">
                  Create {role === "creative" ? "Tech Creative" : "Founder"} Account
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
      </Card>
    </div>
  )
}
