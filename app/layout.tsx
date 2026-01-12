import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://treez-loyalty-form.vercel.app"),
  title: "Treez Loyalty Onboarding",
  description: "Get started with Treez Loyalty - Submit your brand assets",
  keywords: ["treez", "loyalty", "dispensary", "cannabis", "retail"],
  authors: [{ name: "Treez" }],
  openGraph: {
    title: "Treez Loyalty Onboarding",
    description: "Get started with Treez Loyalty - Submit your brand assets",
    type: "website",
    siteName: "Treez Loyalty",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Treez Loyalty Onboarding",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Treez Loyalty Onboarding",
    description: "Get started with Treez Loyalty - Submit your brand assets",
    images: ["/og-image.svg"],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
