import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { WalletProvider } from "@/hooks/use-wallet";
import GlobalLoading from "@/components/globalLoading";



const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BaseSkill - Decentralized Skill Verification on Base",
  description:
    "BaseSkill is a decentralized platform on the Base blockchain where users can prove their skills by completing challenges and earn NFT badges.",
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WalletProvider>
            {children}
            <GlobalLoading /> 
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
