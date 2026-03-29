import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} - Creator Donation Platform`,
  description: "Support your favorite content creators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased font-sans bg-slate-50 text-slate-800">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
