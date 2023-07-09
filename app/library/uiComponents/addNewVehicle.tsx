"use client";
import { ChangeEvent, useState } from "react";
import { FaPlus } from "react-icons/fa";
import Input from "./inputComponent";
import Select from "./selectComponent";
import DatePicker from "./datePickerComponent";
import Button from "./buttonComponent";
import { IVehicle } from "../mongoDB/vehicleData";

const newVehicle: Partial<IVehicle> = {
     make: "",
     model: "",
     type: undefined,
     nickName: "",
     inUseFrom: new Date(new Date().setHours(0, 0, 0, 0)),
     primaryFuel: undefined,
     registeringDate: new Date(new Date().setHours(0, 0, 0, 0)),
     year: 0,
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
          } else if (e.target.name === "registerNumber") {
               setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value.toUpperCase() }));
          } else {
               setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
          }
     };
     const resetAndCloseModal = () => {
          setFormData(newVehicle);
          toggleModal();
     };
     const handleSubmit = async (e: any) => {
          e.preventDefault();
          if (formData.type !== undefined && formData.primaryFuel !== undefined) {
               console.log("New vehicle form data: ", formData);
               const res = await fetch("/api/vehicle", {
                    method: "POST",
                    body: JSON.stringify(formData),
                    headers: { "Content-Type": "application/json" },
               });
          }
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
                         <div className="relative top-10 z-10 mx-auto max-h-[80%] overflow-y-auto rounded-md border-2 border-solid border-slate-600 bg-slate-300 shadow-md md:w-3/4 lg:w-1/2">
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
                                             placeholder={"Merkki"}
                                             required
                                             label="Merkki"
                                             type="text"
                                             maxLength={20}
                                             value={formData.make}
                                             onChange={handleFormChange}
                                        />
                                        <Input
                                             name="model"
                                             placeholder={"Malli"}
                                             required
                                             label="Malli"
                                             type="text"
                                             maxLength={50}
                                             value={formData.model}
                                             onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormChange(e)}
                                        />
                                        <Input
                                             name="year"
                                             placeholder={"Vuosimalli"}
                                             required
                                             label="Vuosimalli"
                                             type="number"
                                             min={1900}
                                             max={new Date().getFullYear() + 1}
                                             value={formData.year}
                                             onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormChange(e)}
                                        />
                                        <Input
                                             name="nickName"
                                             placeholder={"Lempinimi"}
                                             label="Lempinimi"
                                             type="text"
                                             maxLength={20}
                                             value={formData.nickName}
                                             onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormChange(e)}
                                        />
                                        <Input
                                             name="registerNumber"
                                             placeholder={"ABC-123"}
                                             label="Rekisteritunnus"
                                             type="text"
                                             maxLength={7}
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
                                        <Input
                                             name="vehicleImage"
                                             placeholder={"Liitä kuva"}
                                             label="Ajoneuvon kuva"
                                             type="file"
                                             // value={formData.registerNumber}
                                             // onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormChange(e)}
                                        />
                                        <hr />
                                        <div className="flex w-full columns-2 flex-row justify-evenly gap-4">
                                             <Button
                                                  type="button"
                                                  buttonText="Peruuta"
                                                  variant="secondary"
                                                  // className="border-2 border-solid border-gray-500 bg-transparent text-gray-500"
                                                  onClick={resetAndCloseModal}
                                             />
                                             <Button
                                                  type="submit"
                                                  buttonText="Tallenna"
                                                  variant="primary"
                                                  onClick={handleSubmit}
                                             />
                                        </div>
                                   </form>
                              </div>
                         </div>
                    </div>
               ) : null}
          </>
     );
}
