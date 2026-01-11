import Navbar from "@/components/Navbar/index";
import "../globals.css";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Shiksha | AI-Powered Student Dropout Prevention System",
  description:
    "Revolutionizing Student Retention with AI-Driven Insights and Interventions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Navbar />
        <Toaster />
        {children}
        <Footer />
      </body>
    </html>
  );
}
