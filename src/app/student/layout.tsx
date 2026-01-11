"use client";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import axios from "axios";
import Loading from "@/components/Loading";

const Component = ({ children }: { children: React.ReactNode }) => {
  const { setUser, user } = useAuth();
  const fetchUser = async () => {
    const response = await axios.get("/api/auth/verifytoken");
    if (response.data) {
      setUser(response.data.user);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <title>
          Student | Shiksha | R. C. Patel Institute of Technology, Shirpur
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Shiksha is a comprehensive Student ERP and dropout prediction system designed for R. C. Patel Institute of Technology, Shirpur. It streamlines academic and administrative processes while utilizing advanced analytics to identify at-risk students and provide timely interventions."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased montserrat max-h-screen overflow-hidden">
        {!user ? (
          <Loading />
        ) : (
          <>
            <Toaster />
            <Navbar>{children}</Navbar>
          </>
        )}
      </body>
    </html>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <Component>{children}</Component>
    </AuthProvider>
  );
}
