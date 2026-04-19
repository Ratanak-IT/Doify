import "./globals.css";
import type { Metadata, Viewport } from "next";
import RootProviders from "./RootProviders";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://doify-self.vercel.app"),
  title: {
    default: "Doify — Where teams move work forward",
    template: "%s | Doify",
  },
  description:
    "Doify helps teams manage projects, tasks, and collaboration with a clean kanban workflow, shared workspaces, and real-time productivity management.",
  applicationName: "Doify",
  authors: [{ name: "Doify", url: "https://doify-self.vercel.app" }],
  keywords: [
    "project management",
    "team collaboration",
    "task tracker",
    "kanban board",
    "productivity",
    "work management",
    "Doify",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Doify — Where teams move work forward",
    description:
      "Doify helps teams manage projects, tasks, and collaboration with a clean kanban workflow, shared workspaces, and real-time productivity management.",
    type: "website",
    url: "https://doify-self.vercel.app",
    siteName: "Doify",
    images: [
      {
        url: "/file.svg",
        width: 1200,
        height: 630,
        alt: "Doify — Team task and project management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Doify — Where teams move work forward",
    description:
      "Doify helps teams manage projects, tasks, and collaboration with a clean kanban workflow, shared workspaces, and real-time productivity management.",
    images: ["/file.svg"],
    creator: "@Doify",
  },
  icons: {
    icon: "/file.svg",
    shortcut: "/file.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}