
import type React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import FooterVisibility from "@/components/footer-visibility";
// import { AuthProvider } from "@/context/auth-context";
import ReduxProvider from "@/api/provider";
import { ChatProvider } from "@/context/chat-context";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata = {
  title: "Panmae - Connect Founders with Tech Creatives",
  description:
    "A platform where startup founders and passion-driven tech creatives collaborate on innovative products",
  generator: "v0.dev",
  icons: {
    icon: "/Panmae2.png",
    apple: "/Panmae2.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={dmSans.variable}>
        <ReduxProvider > 
          {/* <AuthProvider> */}
            <ChatProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem={false}
                forcedTheme="dark"
                disableTransitionOnChange
              >
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <FooterVisibility />
                </div>
                <Toaster/>
             
              </ThemeProvider>
            </ChatProvider>
          {/* </AuthProvider> */}
        </ReduxProvider>
      </body>
    </html>
  );
}
