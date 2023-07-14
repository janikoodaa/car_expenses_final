"use client";
import Select from "../library/uiComponents/selectComponent";
import Input from "../library/uiComponents/inputComponent";
import { DateTime } from "luxon";
import DatePicker from "../library/uiComponents/datePickerComponent";
import Button from "../library/uiComponents/buttonComponent";
import Image from "next/image";
import { IVehicle } from "../library/models/Vehicle";
import { ChangeEvent, useState } from "react";

export interface IVehicleForm extends IVehicle {
     inUseFromString: string;
     registeringDateString: string;
}

interface IVehicleFormProps {
     purpose: "add" | "modify";
     closeModal?: () => void;
}

const emptyVehicle: Omit<IVehicleForm, "inUseFrom" | "registeringDate" | "inUseTo" | "inUseToString" | "owner"> = {
     make: "",
     model: "",
     type: undefined,
     nickName: "",
     inUseFromString: "",
     primaryFuel: undefined,
     registeringDateString: "",
     year: 0,
     registerNumber: "",
     active: true,
     imageUrl: "",
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

export default function AddOrModifyVechile({ purpose, closeModal }: IVehicleFormProps): JSX.Element {
     const [loading, setLoading] = useState<boolean>(false);
     const [formData, setFormData] = useState<Omit<IVehicleForm, "inUseFrom" | "registeringDate" | "inUseTo" | "owner">>(emptyVehicle);

     const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
          //   console.log(`handleFormChange e.target.name: ${e.target.name} and e.target.value: ${e.target.value}`);
          if (e.target.name === "registeringDateString" || e.target.name === "inUseFromString") {
               setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
          } else if (e.target.name === "registerNumber") {
               setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value.toUpperCase() }));
          } else {
               setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
          }
     };

     const resetAndCloseModal = () => {
          setFormData(emptyVehicle);
          closeModal && closeModal();
     };

     const handleSubmit = async (e: any) => {
          e.preventDefault();
          setLoading(true);
          console.log("New vehicle form data: ", formData);
          if (formData.type !== undefined && formData.primaryFuel !== undefined) {
               const res = await fetch("/api/vehicle", {
                    method: "POST",
                    body: JSON.stringify(formData),
                    headers: { "Content-Type": "application/json" },
               });
               //    console.log("Submit res: ", res);
               const json = await res.json();
               console.log("Submit json: ", json);
               setLoading(false);
               if (json.status === "ok") {
                    window.scrollTo({ top: 0 });
                    window.location.reload();
               }
          }
     };
     return (
          <form
               className="mx-8 flex flex-col gap-2"
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
                    onChange={handleFormChange}
               />
               <Input
                    name="year"
                    placeholder={"Vuosimalli"}
                    required
                    label="Vuosimalli"
                    type="number"
                    min={1950}
                    max={DateTime.now().plus({ years: 1 }).get("year")}
                    value={formData.year}
                    onChange={handleFormChange}
               />
               <Input
                    name="nickName"
                    placeholder={"Lempinimi"}
                    label="Lempinimi"
                    type="text"
                    maxLength={20}
                    value={formData.nickName}
                    onChange={handleFormChange}
               />
               <Input
                    name="registerNumber"
                    placeholder={"ABC-123"}
                    label="Rekisteritunnus"
                    type="text"
                    maxLength={7}
                    value={formData.registerNumber}
                    onChange={handleFormChange}
               />
               <Select
                    name="primaryFuel"
                    label="Polttoaine"
                    options={fuelTypes}
                    value={formData.primaryFuel}
                    onChange={handleFormChange}
               />
               <DatePicker
                    name="registeringDateString"
                    label="Rekisteröintipäivä"
                    dateValue={formData.registeringDateString ?? ""}
                    max={DateTime.now().toISODate() as string}
                    onChange={handleFormChange}
               />
               <DatePicker
                    name="inUseFromString"
                    label="Käyttöönottopäivä"
                    dateValue={formData.inUseFromString ?? ""}
                    max={DateTime.now().toISODate() as string}
                    onChange={handleFormChange}
               />
               {purpose === "modify" ? <p>Aktiivinen: {formData.active.toString()}</p> : null}
               <Input
                    name="imageUrl"
                    placeholder={"https://..."}
                    label="Linkki kuvaan"
                    type="text"
                    value={formData.imageUrl ?? ""}
                    onChange={handleFormChange}
               />
               {formData.imageUrl ? (
                    <div className="">
                         <p className="pl-2 text-sm">Kuvan esikatselu</p>
                         <Image
                              src={encodeURI(formData.imageUrl)}
                              alt={`${formData.make} ${formData.model}`}
                              width={200}
                              height={200}
                              style={{ maxHeight: "100%", width: "auto" }}
                              priority
                         />
                    </div>
               ) : null}
               <div className="flex w-full columns-2 flex-row justify-evenly gap-4">
                    <Button
                         type="button"
                         buttonText="Peruuta"
                         variant="secondary"
                         disabled={loading}
                         onClick={resetAndCloseModal}
                    />
                    <Button
                         type="submit"
                         buttonText={!loading ? "Tallenna" : "Tallentaa"}
                         variant="primary"
                         disabled={loading}
                         onClick={handleSubmit}
                    />
               </div>
          </form>
     );
}
