import type { Metadata } from "next";
import "./globals.css";
import  "bootstrap/dist/css/bootstrap.min.css";
import AddBootstrap from "./ui/AddBootstrap";

export const metadata: Metadata = {
  title: "FAZE",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AddBootstrap />
        {children}
      </body>
    </html>
  );
}
