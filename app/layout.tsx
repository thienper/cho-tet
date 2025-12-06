import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Tết Market - Chợ Tết Online 2026",
  description: "Mua sắm hàng Tết chất lượng cao, giá tốt nhất",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="https://e7.pngegg.com/pngimages/787/487/png-clipart-computer-icons-cost-service-hoa-mai-thumbnail.png" />
        <link rel="apple-touch-icon" href="https://e7.pngegg.com/pngimages/787/487/png-clipart-computer-icons-cost-service-hoa-mai-thumbnail.png" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
