import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fichas para Blackjack Online",
  description:
    "Gestiona tu dinero ficticio como fichas de apuestas y disfruta de una experiencia de blackjack auténtica, ideal para mejorar tus habilidades y estrategias antes de jugar con dinero real.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
