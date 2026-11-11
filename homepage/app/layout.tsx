import type { Metadata, Viewport } from "next";
import "./globals.css";
import { themeInitializationScript } from "./theme";
import { siteBase } from "./site";
import siteConfig from "../../site.config.json";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  // Reuse the documentation favicon so the homepage adds nothing at the site root.
  icons: { icon: `${siteBase}/docs/favicon.ico` },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#101f38",
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
