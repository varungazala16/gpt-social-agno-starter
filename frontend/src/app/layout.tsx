import type { Metadata } from "next";
import "./globals.css";
import "@copilotkit/react-ui/styles.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
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
        <CopilotKit runtimeUrl="/api/copilotkit" agent="copilotAgent">
          <Providers>
            <div className="flex min-h-screen">
              {/* AI Chat Panel */}
              <aside className="w-1/4 fixed inset-y-0 left-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
                <div className="h-full overflow-hidden p-4">
                  <CopilotChat
                    className="h-full"
                    labels={{
                      initial: `Welcome to Post Studio! 🎬`
                    }}
                  />
                </div>
              </aside>

              {/* Main Content Area - offset by 25% */}
              <div className="flex-1 ml-[25%]">
                {children}
              </div>
            </div>
          </Providers>
        </CopilotKit>
        <Toaster />
        <PrelineScriptWrapper />
      </body>
    </html>
  );
}
