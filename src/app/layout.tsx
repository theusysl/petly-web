import Footer from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Petly",
  description: "Uma rede que aproxima pessoas e animais que precisam se encontrar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-petly-cream font-sans text-petly-ink">
        <Navbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
