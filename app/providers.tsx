"use client";
import { SessionProvider } from "next-auth/react";
// import { createContext, useContext, useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
     return <SessionProvider>{children}</SessionProvider>;
     // return (
     //      <SessionProvider>
     //           <ModalProvider>{children}</ModalProvider>
     //      </SessionProvider>
     // );
}

// interface IModalContext {
//      modalOpen: boolean;
//      toggleModalOpen: () => void;
// }

// const ModalContext: React.Context<IModalContext> = createContext<IModalContext>({ modalOpen: false, toggleModalOpen: () => {} });

// export function useModalContext(): IModalContext {
//      return useContext(ModalContext);
// }

// function ModalProvider({ children }: { children: React.ReactNode }) {
//      const [modalOpen, setState] = useState<boolean>(false);

//      function toggleModalOpen(): void {
//           setState((prev) => !prev);
//      }

//      return <ModalContext.Provider value={{ modalOpen, toggleModalOpen }}>{children}</ModalContext.Provider>;
// }
