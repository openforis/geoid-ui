import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "GeoID",
  description: "Register geospatial features to mint stable GeoIDs, or resolve IDs back to GeoJSON.",
};

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-loaded",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${manrope.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("geoid-theme")==="light"){}else{document.documentElement.classList.add("dark")}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-text-primary transition-colors">
        <ThemeProvider>
          <Navbar />
          <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 py-8">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
