import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Toaster } from "react-hot-toast";
import SessionProvider from "@/components/providers/SessionProvider";
import "./styles.css";

const robo = Roboto({
  weight: "300",
  variable: "--btn-font",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IDKWhatToEat",
  description: "Find random restaurants near you!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${robo.variable} app-background`}>
        <SessionProvider>
          <div className="app-container">{children}</div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1e40af",
                color: "#ffffff",
                border: "1px solid #3b82f6",
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
