"use client";

import Button from "@/app/library/uiComponents/buttonComponent";
import Modal from "@/app/library/uiComponents/modalComponent";
import { useState } from "react";
import AddOrModifyVechile from "../vehicleAddOrModifyForm";

export default function ModifyVehicle({ vehicle }: { vehicle: string }) {
     const [modalOpen, setModalState] = useState<boolean>(false);
     const toggleModal = () => {
          setModalState((prev) => !prev);
     };
     // console.log("modifyButton's vehicle prop: ", vehicle);
     return (
          <div className="mt-2 flex flex-row justify-center gap-2">
               <Button
                    variant="secondary"
                    buttonText="Muokkaa"
                    onClick={toggleModal}
               />
               {modalOpen ? (
                    <Modal headerText="Muokkaa">
                         <div className="overflow-y-auto pb-4 pt-2">
                              <AddOrModifyVechile
                                   purpose="modify"
                                   vehicle={vehicle}
                                   closeModal={() => toggleModal()}
                              />
                         </div>
                    </Modal>
               ) : null}
          </div>
     );
}
