
import type React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
// import { AuthProvider } from "@/context/auth-context";
import ReduxProvider from "@/api/provider";
import { store } from "@/api/store";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sales Pitch - Connect Founders with Tech Creatives",
  description:
    "A platform where startup founders and passion-driven tech creatives collaborate on innovative products",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ReduxProvider > 
          {/* <AuthProvider> */}
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </ThemeProvider>
          {/* </AuthProvider> */}
        </ReduxProvider>
      </body>
    </html>
  );
}
