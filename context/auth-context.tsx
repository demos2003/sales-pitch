// "use client"

// import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
// import { useRouter } from "next/navigation"

// interface User {
//   id: string
//   name: string
//   email: string
//   role: "founder" | "creative"
//   avatar?: string
// }

// interface AuthContextType {
//   user: User | null
//   isLoading: boolean
//   isFounder: boolean
//   login: (email: string, password: string, role: "founder" | "creative") => Promise<void>
//   signup: (userData: any) => Promise<void>
//   logout: () => void
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const router = useRouter()

//   // Check if user is logged in on mount
//   useEffect(() => {
//     const checkAuth = () => {
//       // In a real app, this would verify the auth token with your backend
//       const hasAuthToken = document.cookie.includes("auth_token=")

//       if (hasAuthToken) {
//         // Get user role from cookie
//         const cookies = document.cookie.split(";")
//         const roleCookie = cookies.find((cookie) => cookie.trim().startsWith("user_role="))
//         const role = roleCookie ? (roleCookie.split("=")[1].trim() as "founder" | "creative") : "founder"

//         // Mock user data - in a real app, you'd fetch this from your API
//         setUser({
//           id: "1",
//           name: "Alex Johnson",
//           email: "alex@example.com",
//           role: role,
//           avatar: "AJ",
//         })
//       }

//       setIsLoading(false)
//     }

//     checkAuth()
//   }, [])

//   // const login = async (email: string, password: string, role: "founder" | "creative") => {
//   //   setIsLoading(true)

//   //   try {
//   //     // In a real app, this would call your auth API
//   //     // Mock successful login
//   //     document.cookie = "auth_token=mock_token; path=/; max-age=86400"
//   //     document.cookie = `user_role=${role}; path=/; max-age=86400`

//   //     // Mock user data
//   //     setUser({
//   //       id: "1",
//   //       name: "Alex Johnson",
//   //       email: email,
//   //       role: role,
//   //       avatar: "AJ",
//   //     })

//   //     router.push("/dashboard")
//   //   } catch (error) {
//   //     console.error("Login failed:", error)
//   //     throw error
//   //   } finally {
//   //     setIsLoading(false)
//   //   }
//   // }

//   const signup = async (userData: any) => {
//     setIsLoading(true)

//     try {
//       // In a real app, this would call your auth API
//       // Mock successful signup
//       document.cookie = "auth_token=mock_token; path=/; max-age=86400"
//       document.cookie = `user_role=${userData.role}; path=/; max-age=86400`

//       // Mock user data
//       setUser({
//         id: "1",
//         name: userData.name || "New User",
//         email: userData.email,
//         role: userData.role,
//         avatar: userData.name ? userData.name.substring(0, 2).toUpperCase() : "NU",
//       })

//       router.push("/dashboard")
//     } catch (error) {
//       console.error("Signup failed:", error)
//       throw error
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const logout = () => {
//     // Clear the auth token
//     document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
//     document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
//     setUser(null)
//     router.push("/")
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isLoading,
//         isFounder: user?.role === "founder" || false,
//         // login,
//         signup,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }
