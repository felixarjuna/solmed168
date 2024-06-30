import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Toaster } from "~/components/ui/toaster";
import Logo from "./_components/logo";

export const metadata = {
  title: "SOLMED 168",
  description: "Tracking system for Solmed 168",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <div className="flex flex-col">
          <Logo />
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
