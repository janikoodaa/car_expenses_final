"use client";
import { ChangeEvent, useState } from "react";
import { FaPlus } from "react-icons/fa";
import Input from "./inputComponent";
import Select from "./selectComponent";
import DatePicker from "./datePickerComponent";

const newVehicle: Partial<IVehicle> = {
     make: "",
     model: "",
     type: "car",
     nickName: "",
     inUseFrom: new Date(),
     primaryFuel: undefined,
     registeringDate: new Date(),
     year: new Date().getFullYear(),
     registerNumber: "",
     active: true,
     image: "",
     coUsers: [],
};

/// todo: nämä vietävä kantaan
const vehicleTypes = [
     { value: undefined, description: "Ei valittu" },
     { value: "car", description: "henkilöauto" },
     { value: "bicycle", description: "polkupyörä" },
];
const fuelTypes = [
     { value: undefined, description: "Ei valittu" },
     { value: "95E10", description: "95E10" },
     { value: "98E5", description: "98E5" },
     { value: "Diesel", description: "Diesel" },
];

export default function AddVehicleCard() {
     const [modalOpen, setModalState] = useState<boolean>(false);
     const [formData, setFormData] = useState<Partial<IVehicle>>(newVehicle);
     const toggleModal = () => {
          setModalState((prev) => !prev);
     };
     const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
          //   console.log(`handleFormChange e.target.name: ${e.target.name} and e.target.value: ${e.target.value}`);
          if (e.target.name === "registeringDate" || e.target.name === "inUseFrom") {
               setFormData((prev) => ({ ...prev, [e.target.name]: new Date(e.target.value) }));
          } else {
               setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
          }
     };
     const resetAndCloseModal = () => {
          setFormData(newVehicle);
          toggleModal();
     };
     const handleSubmit = (e: any) => {
          e.preventDefault();
          console.log("New vehicle form data: ", formData);
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
                    <div className="fixed inset-0 h-full w-full overflow-y-auto backdrop-blur">
                         <div className="relative top-10 z-10 mx-auto max-h-[80%] w-1/2 overflow-y-auto rounded-md border-2 border-solid border-slate-600 bg-slate-300 shadow-md">
                              <div className="fixed w-full bg-slate-300 px-4 py-2 font-bold">
                                   <h1>Lisää uusi ajoneuvo</h1>
                              </div>
                              <hr />
                              <div>
                                   <form
                                        className="mx-8 mb-4 mt-10 flex flex-col gap-2"
                                        onSubmit={handleSubmit}
                                   >
                                        <Select
                                             name="type"
                                             label="Tyyppi"
                                             options={vehicleTypes}
                                             value={formData.type}
                                             onChange={handleFormChange}
                                        />
                                        <Input
                                             name="make"
                                             label="Merkki"
                                             type="text"
                                             required
                                             placeholder={"Merkki"}
                                             value={formData.make}
                                             onChange={handleFormChange}
                                        />
                                        <Input
                                             name="model"
                                             label="Malli"
                                             type="text"
                                             required
                                             placeholder={"Malli"}
                                             value={formData.model}
                                             onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormChange(e)}
                                        />
                                        <Input
                                             name="year"
                                             label="Vuosimalli"
                                             type="number"
                                             required
                                             placeholder={"Vuosimalli"}
                                             value={formData.year}
                                             onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormChange(e)}
                                        />
                                        <Input
                                             name="nickName"
                                             label="Lempinimi"
                                             type="text"
                                             placeholder={"Kottero"}
                                             value={formData.nickName}
                                             onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormChange(e)}
                                        />
                                        <Input
                                             name="registerNumber"
                                             label="Rekisteritunnus"
                                             type="text"
                                             placeholder={"ABC-123"}
                                             value={formData.registerNumber}
                                             onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormChange(e)}
                                        />
                                        <Select
                                             name="primaryFuel"
                                             label="Polttoaine"
                                             options={fuelTypes}
                                             value={formData.primaryFuel}
                                             onChange={handleFormChange}
                                        />
                                        <DatePicker
                                             name="registeringDate"
                                             label="Rekisteröintipäivä"
                                             dateValue={formData.registeringDate || new Date("1900-01-01")}
                                             onChange={handleFormChange}
                                        />
                                        <DatePicker
                                             name="inUseFrom"
                                             label="Käyttöönottopäivä"
                                             dateValue={formData.inUseFrom || new Date("1900-01-01")}
                                             onChange={handleFormChange}
                                        />
                                        <hr />
                                        <div className="flex w-full columns-2 flex-row justify-evenly gap-4">
                                             <button
                                                  type="button"
                                                  className="flex w-32 bg-gray-500 text-center text-white"
                                                  onClick={resetAndCloseModal}
                                             >
                                                  Peruuta
                                             </button>
                                             <button
                                                  type="submit"
                                                  className="flex w-32 bg-green-700 text-center text-white"
                                             >
                                                  Tallenna
                                             </button>
                                        </div>
                                   </form>
                              </div>
                         </div>
                    </div>
               ) : null}
          </>
     );
}
