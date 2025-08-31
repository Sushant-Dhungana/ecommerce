import type { Metadata } from "next";
import { Inter } from "next/font/google"; //inter font from google
import "@/assets/styles/globals.css";
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/lib/constants";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | E-Commerce",
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light" //default theme i can use
          enableSystem //enable system theme except dark and light
          disableTransitionOnChange //disable all css transition on change
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
