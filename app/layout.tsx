import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
