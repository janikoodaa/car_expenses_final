import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";
import Navbar from "./library/uiComponents/navbar";
import Footer from "./footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
     title: "Kul(k)upeli - etusivu",
     description: "Sovellus, jolla voi pitää kirjaa ajoneuvoon liittyvistä kuluista ja tapahtumista.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
          <html lang="fi">
               <Providers>
                    <body className={inter.className + "bg-gray-300"}>
                         <div
                              className="relative bg-gray-300"
                              style={{ minHeight: "100vh" }}
                         >
                              <Navbar />
                              {children}
                              <Footer />
                         </div>
                    </body>
               </Providers>
          </html>
     );
}
