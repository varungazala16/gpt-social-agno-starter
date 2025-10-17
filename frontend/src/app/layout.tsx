import type { Metadata } from "next";
import "./globals.css";
import "@copilotkit/react-ui/styles.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { CopilotKit } from "@copilotkit/react-core";
import PrelineScriptWrapper from "@/components/PrelineScriptWrapper";
import { LayoutContent } from "./layout-content";

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
        <CopilotKit runtimeUrl="/api/copilotkit" agent="copilotAgent">
          <Providers>
            <LayoutContent>{children}</LayoutContent>
          </Providers>
        </CopilotKit>
        <Toaster />
        <PrelineScriptWrapper />
      </body>
    </html>
  );
}
