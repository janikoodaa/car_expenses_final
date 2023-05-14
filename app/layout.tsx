import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
     title: "Create Next App",
     description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
          <html lang="fi">
               <Providers>
                    <body className={inter.className}>{children}</body>
               </Providers>
          </html>
     );
}
