import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project ExyROMs — Exynos 9611 Firmware Hub",
  description:
    "A community firmware hub for Samsung Galaxy Exynos 9611 devices. Explore the catalog, supported devices and flashing guide.",
  applicationName: "Project ExyROMs",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Project ExyROMs — Exynos 9611 Firmware Hub",
    description: "Firmware catalog and deployment notes for the Samsung Galaxy Exynos 9611 family.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
