"use client";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import Modal from "../library/uiComponents/modalComponent";
import AddOrModifyVechile from "./vehicleAddOrModifyForm";

export default function AddVehicleCard() {
     const [modalOpen, setModalState] = useState<boolean>(false);
     const toggleModal = () => {
          setModalState((prev) => !prev);
     };

     return (
          <>
               <div className="col-span-1 grid h-52 w-full items-center justify-center rounded-md border-2 border-slate-200 bg-slate-300">
                    <h2 className="font-bold">
                         <button onClick={toggleModal}>
                              <FaPlus />
                         </button>
                    </h2>
               </div>
               {modalOpen ? (
                    <Modal headerText="Lisää uusi ajoneuvo">
                         <div className="overflow-y-auto pb-4 pt-2">
                              <AddOrModifyVechile
                                   purpose="add"
                                   closeModal={() => toggleModal()}
                              />
                         </div>
                    </Modal>
               ) : null}
          </>
     );
}
