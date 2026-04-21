import type { Metadata } from "next";
import { Cinzel, EB_Garamond, JetBrains_Mono, Uncial_Antiqua } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const ebGaramond = EB_Garamond({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const uncialAntiqua = Uncial_Antiqua({
  variable: "--font-lexforge",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lexforge",
  description: "Forge your vocabulary. Gamified RPG trainer powered by spaced repetition.",
  applicationName: "Lexforge",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Lexforge",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ebGaramond.variable} ${jetbrainsMono.variable} ${cinzel.variable} ${uncialAntiqua.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
