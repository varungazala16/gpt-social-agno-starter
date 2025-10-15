import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import PrelineScriptWrapper from "@/components/PrelineScriptWrapper";

export const metadata: Metadata = {
  title: "Video App - GPT Social",
  description: "Play, upload, record, and edit videos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <Providers>{children}</Providers>
        <Toaster />
        <PrelineScriptWrapper />
      </body>
    </html>
  );
}
