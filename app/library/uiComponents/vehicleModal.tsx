"use client";
import { useState } from "react";
// import { useModalContext } from "../providers";
import { HiOutlineDocumentText } from "react-icons/hi";

// export default function VehicleModal() {
//      const { modalOpen } = useModalContext();
//      return (
//           <dialog open={modalOpen}>
//                <h1>Testimodaali</h1>
//           </dialog>
//      );
// }

// export function OpenVehicleModalButton() {
//      const { toggleModalOpen } = useModalContext();
//      return (
//           <button
//                className={"absolute bottom-1 right-1 text-xl"}
//                onClick={toggleModalOpen}
//           >
//                <HiOutlineDocumentText />
//           </button>
//      );
// }

export function OpenVehicleModalButton() {
     const [modalOpen, setModal] = useState(false);

     const toggleModal = () => {
          setModal((prev) => !prev);
     };
     return (
          <>
               <button
                    className={"absolute bottom-1 right-1 text-xl"}
                    onClick={toggleModal}
               >
                    <HiOutlineDocumentText />
               </button>
               {modalOpen ? (
                    <div className="fixed inset-0 h-full w-full overflow-y-auto backdrop-blur">
                         <div className="relative top-10 z-10 mx-auto h-1/4 w-1/2 bg-red-600 text-center">
                              <p>Testimodaali</p>
                              <button onClick={toggleModal}>Sulje</button>
                         </div>
                    </div>
               ) : null}
          </>
     );
}
