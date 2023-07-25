"use client";
import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import protectedLinks from "@/linksForSignedInUsers.json";
import SignInButton from "./signInButton";
import logo from "@/public/images/kulkupeli_logo.png";

export default function SmallScreenNav(): JSX.Element {
     const [showBurgerMenu, setShowBurgerMenu] = useState<boolean>(false);
     const { data: session, status } = useSession();
     return (
          <>
               <ul className="flex h-full w-full list-none flex-col gap-3 bg-slate-600 text-slate-100 lg:hidden">
                    <li className="flex h-14 items-center">
                         <div className="flex w-full flex-row items-center justify-between">
                              <Link
                                   href={"/"}
                                   className="flex"
                              >
                                   <Image
                                        src={logo}
                                        alt={"Kulkupeli-logo"}
                                        className="h-14 w-auto"
                                   />
                              </Link>
                              {status === "unauthenticated" ? (
                                   <SignInButton />
                              ) : (
                                   <button
                                        className="ml-auto flex h-7 rounded-md border-2 border-solid border-slate-100 p-1"
                                        onClick={() => setShowBurgerMenu((prev) => !prev)}
                                        disabled={status === "loading"}
                                   >
                                        {!showBurgerMenu ? <GiHamburgerMenu className="text-md" /> : <IoMdClose className="text-md" />}
                                   </button>
                              )}
                         </div>
                    </li>
               </ul>
               {showBurgerMenu ? (
                    <ul
                         className="absolute left-0 top-14 z-20 flex w-full flex-col bg-slate-600 pb-2"
                         onMouseLeave={() => {
                              setShowBurgerMenu((prev) => !prev);
                         }}
                    >
                         {protectedLinks.map((link, idx) => {
                              return (
                                   <li
                                        key={idx}
                                        className="flex h-10 w-full items-center justify-center"
                                        onClick={() => {
                                             setShowBurgerMenu((prev) => !prev);
                                        }}
                                   >
                                        <Link
                                             href={link.path}
                                             className="w-full p-2 text-center hover:bg-slate-500"
                                        >
                                             {link.description}
                                        </Link>
                                   </li>
                              );
                         })}
                         <li
                              className="flex h-10 w-full items-center justify-center"
                              onClick={() => {
                                   setShowBurgerMenu((prev) => !prev);
                              }}
                         >
                              <Link
                                   href="/user"
                                   className="w-full p-2 text-center hover:bg-slate-500"
                              >
                                   {session?.user.firstName}
                              </Link>
                         </li>
                         <li className="h-10 w-full">
                              <button
                                   className=" w-full p-2 text-center hover:bg-slate-500"
                                   onClick={() => signOut({ callbackUrl: "/" })}
                              >
                                   Kirjaudu ulos
                              </button>
                         </li>
                    </ul>
               ) : null}
          </>
     );
}

// export function BurgerMenuItems({
//      children,
//      setShowBurgerMenu,
// }: {
//      children: React.ReactNode;
//      setShowBurgerMenu: Dispatch<SetStateAction<boolean>>;
// }): JSX.Element {
//      const { data: session } = useSession();
//      return (
//           <div
//                onMouseLeave={() => setShowBurgerMenu((prev) => !prev)}
//                onClick={() => setShowBurgerMenu((prev) => !prev)}
//                className="fixed left-0 top-14 z-10 w-[100vw] bg-slate-600"
//           >
//                <ul className="mx-4 flex h-full list-none flex-col justify-items-center gap-3">
//                     {children}
//                     <li>
//                          <Link href="/user">{session?.user.firstName}</Link>
//                     </li>
//                </ul>
//           </div>
//      );
// }
