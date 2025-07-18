import "@repo/ui/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "../components/theme-provider";
import { WalletProviders } from "../components/WalletProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Turborepo",
  description: "Generated by create turbo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <WalletProviders>{children}</WalletProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
