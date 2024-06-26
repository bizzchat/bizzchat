import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import SupabaseProvider from "@/core/supabase/supabase-provider";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={
          inter.className + " min-h-screen bg-background font-sans antialiased"
        }
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SupabaseProvider>
            <div className="relative flex flex-col min-h-screen">
              <div className="flex flex-col flex-1 ">{children}</div>
            </div>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
