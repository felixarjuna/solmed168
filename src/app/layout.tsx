import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Toaster } from "~/components/ui/toaster";

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
          <nav className="m-8 mb-0 text-xl font-extrabold">SOLMED 168</nav>
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
