import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { mi } from "@/fonts/fonts";
import "./globals.css";
import { ToastProvider } from "@/context/ToastContext";
import ReactQueryProvider from "@/utils/ReactQueryProvider";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Grats Payment Gateway",
  description: "",
  openGraph: {
    title: "Grats Payment Gateway",
    description: "",
    url: "https://gateway.mygrats.com",
    siteName: "Grats Payment Gateway",
    images: [
      {
        url: "https://res.cloudinary.com/dcvd8wel9/image/upload/v1760567804/Screenshot_2025-10-15_233623_ci7p3w.png", 
        width: 1345,
        height: 623,
        alt: "Grats Payment Gateway",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grats Payment Gateway",
    description: "",
    images: ["https://res.cloudinary.com/dcvd8wel9/image/upload/v1760567804/Screenshot_2025-10-15_233623_ci7p3w.png"], 
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 
  return (
    <html lang="en">
      <body className={`${inter.className} ${mi.variable} antialiased`}>
        <ReactQueryProvider>
          <ToastProvider>{children} </ToastProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
