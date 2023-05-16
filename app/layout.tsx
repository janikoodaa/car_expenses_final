import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
     title: "Auton kululoki",
     description: "Sovellus, jolla voi pitää kirjaa autoon liittyvistä kuluista ja tapahtumista.",
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
