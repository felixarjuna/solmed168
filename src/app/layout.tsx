import "~/styles/globals.css";

import localFont from "@next/font/local";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "~/components/ui/toaster";
import Logo from "./_components/logo";
import { ThermalPrinterProvider } from "./order/_hooks/useThermalPrinterContext";

export const metadata = {
  title: "SOLMED 168",
  description: "Tracking system for Solmed 168",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const vividly = localFont({
  src: "./_assets/Vividly-Regular.otf",
  variable: "--font-vividly",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${vividly.variable} ${GeistSans.variable}`} lang="en">
      <body>
        <ThermalPrinterProvider>
          <div className="flex flex-col">
            <Logo />
            {children}
          </div>
          <Toaster />
        </ThermalPrinterProvider>
      </body>
    </html>
  );
}
