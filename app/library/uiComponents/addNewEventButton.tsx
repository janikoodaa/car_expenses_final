"use client";

import { useState } from "react";
import Modal from "./modalComponent";
import Button from "./buttonComponent";

export default function AddNewEvent(): JSX.Element {
     const [showOptions, setShowOptions] = useState<boolean>(false);
     const [showAddRefuelModal, setShowAddRefuelModal] = useState<boolean>(false);
     const [showAddEventModal, setShowAddEventModal] = useState<boolean>(false);

     const toggleOptionsVisibility = () => {
          setShowOptions((prev) => !prev);
     };

     const handleAddRefuel = () => {
          setShowOptions(false);
          setShowAddRefuelModal(true);
     };

     const handleAddOtherEvent = () => {
          setShowOptions(false);
          setShowAddEventModal(true);
     };

     const cancelAddRefuel = () => {
          setShowAddRefuelModal(false);
     };

     const cancelAddEvent = () => {
          setShowAddEventModal(false);
     };

     return (
          <>
               <button
                    className="absolute bottom-4 right-4 z-20 h-10 w-10 rounded-full bg-slate-600 text-center text-2xl font-semibold text-slate-100 shadow-md shadow-gray-500"
                    onClick={toggleOptionsVisibility}
               >
                    {showOptions ? "-" : "+"}
               </button>
               {showOptions ? (
                    <div className="absolute bottom-14 right-14">
                         <ul className="flex flex-col gap-3">
                              <li>
                                   <button
                                        className="h-10 w-48 rounded-full bg-slate-600 text-slate-100 shadow-md shadow-gray-500"
                                        onClick={handleAddRefuel}
                                   >
                                        Lisää tankkaus
                                   </button>
                              </li>
                              <li>
                                   <button
                                        className="h-10 w-48 rounded-full bg-slate-600 text-slate-100 shadow-md shadow-gray-500"
                                        onClick={handleAddOtherEvent}
                                   >
                                        Lisää muu tapahtuma
                                   </button>
                              </li>
                         </ul>
                    </div>
               ) : null}
               {showAddRefuelModal ? (
                    <Modal headerText="Lisää tankkaus">
                         <p>Tässä voi lisätä tankkauksen</p>
                         <Button
                              onClick={cancelAddRefuel}
                              buttonText="Peruuta"
                         />
                    </Modal>
               ) : null}
               {showAddEventModal ? (
                    <Modal headerText="Lisää muu tapahtuma">
                         <p>Tässä voi lisätä muun tapahtuman</p>
                         <Button
                              onClick={cancelAddEvent}
                              buttonText="Peruuta"
                         />
                    </Modal>
               ) : null}
          </>
     );
}
