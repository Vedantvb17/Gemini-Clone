import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'sonner';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Google Gemini",
  description: "A fully functional, responsive frontend clone of Gemini with OTP authentication, real-time chat, and modern UX features. Built with Next.js 15, TypeScript, and Tailwind CSS.",
  keywords: ["Gemini", "AI Chat", "Next.js", "TypeScript", "React", "Frontend"],
  authors: [{ name: "Frontend Developer" }],
  icons: {
    icon: "/logo.jpeg", 
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster 
          position="top-right" 
          richColors 
          closeButton
          toastOptions={{
            style: {
              background: 'white',
              color: 'black',
              border: '1px solid #e5e7eb'
            },
            className: 'rounded-lg shadow-lg'
          }}
        />
      </body>
    </html>
  );
}
