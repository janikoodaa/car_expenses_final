import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";
import Navbar from "./components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
     title: "Auton kululoki",
     description: "Sovellus, jolla voi pitää kirjaa autoon liittyvistä kuluista ja tapahtumista.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
          <html lang="fi">
               <Providers>
                    <body className={inter.className + " bg-gray-300"}>
                         <Navbar />
                         {children}
                    </body>
               </Providers>
          </html>
     );
}
