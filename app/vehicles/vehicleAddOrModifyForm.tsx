"use client";
import Select from "../library/uiComponents/selectComponent";
import Input from "../library/uiComponents/inputComponent";
import { DateTime } from "luxon";
import DatePicker from "../library/uiComponents/datePickerComponent";
import Button from "../library/uiComponents/buttonComponent";
import Image from "next/image";
import { IVehicle } from "../library/models/Vehicle";
import { ChangeEvent, useState } from "react";
import Switch from "../library/uiComponents/switchComponent";

export interface IVehicleForm extends Omit<IVehicle, "ownerId" | "inUseFrom" | "registeringDate" | "inUseTo" | "inUseToString" | "owner"> {
     inUseFromString: string;
     registeringDateString: string;
}

interface IVehicleFormProps {
     purpose: "add" | "modify";
     vehicle?: string;
     closeModal?: () => void;
}

// type VehicleFormProps = { purpose: "add"; closeModal?: () => void } | { purpose: "modify"; vehicle: IVehicle; closeModal?: () => void };

const emptyVehicle: IVehicleForm = {
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
     coUserIds: [],
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

export default function AddOrModifyVechile({ purpose, closeModal, vehicle }: IVehicleFormProps): JSX.Element {
     const v: IVehicle | null = vehicle
          ? JSON.parse(vehicle, (key, value) => {
                 //   console.log(`revive key: ${key} typeof key: ${typeof key} & value: ${value} typeof value ${typeof value}`);
                 //   if (key === ("registeringDate" || "inUseFrom" || "inUseTo") && value !== "") return new Date(value);
                 if (key === "registeringDate" && value !== "") return new Date(value);
                 if (key === "inUseFrom" && value !== "") return new Date(value);
                 if (key === "inUseTo" && value !== "") return new Date(value);
                 return value;
            })
          : null;
     // console.log("AddOrModifyVechile vehicle to v: ", v);
     const vehicleToModify: Omit<IVehicleForm, "inUseFrom" | "registeringDate" | "inUseTo" | "owner"> | null = v
          ? ({
                 ...v,
                 inUseFromString: DateTime.fromJSDate(v.inUseFrom).toISODate(),
                 registeringDateString: v.registeringDate ? DateTime.fromJSDate(v.registeringDate).toISODate() : "",
            } as Omit<IVehicleForm, "inUseFrom" | "registeringDate" | "inUseTo" | "owner">)
          : null;
     const [loading, setLoading] = useState<boolean>(false);
     const [formData, setFormData] = useState<Omit<IVehicleForm, "inUseFrom" | "registeringDate" | "inUseTo" | "owner">>(
          vehicleToModify ?? emptyVehicle
     );

     const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
          // console.log(`handleFormChange e.target.name: ${e.target.name} and e.target.value: ${e.target.value}`);
          setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
     };

     const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
          // console.log(`handleFormChange e.target.name: ${e.target.name} and e.target.value: ${e.target.value}`);
          if (e.target.name === "registeringDateString" || e.target.name === "inUseFromString") {
               setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
          } else if (e.target.name === "registerNumber") {
               setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value.toUpperCase() }));
          } else if (e.target.name === "active") {
               setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.checked,
                    // inUseTo: e.target.checked ? null : DateTime.now().startOf("day").toISODate(),
               }));
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
          const endpoint: string = "/api/vehicle";
          setLoading(true);
          if (purpose === "add") {
               console.log("New vehicle form data: ", formData);
               if (formData.type !== undefined && formData.primaryFuel !== undefined) {
                    const res = await fetch(endpoint, {
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
          }
          if (purpose === "modify") {
               console.log("Vehicle modification form data: ", formData);
               const res = await fetch(endpoint, {
                    method: "PUT",
                    body: JSON.stringify(formData),
                    headers: { "Content-Type": "application/json" },
               });
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
                    onChange={handleSelectChange}
               />
               <Input
                    name="make"
                    placeholder={"Merkki"}
                    required
                    label="Merkki"
                    type="text"
                    maxLength={20}
                    value={formData.make}
                    onChange={handleInputChange}
               />
               <Input
                    name="model"
                    placeholder={"Malli"}
                    required
                    label="Malli"
                    type="text"
                    maxLength={50}
                    value={formData.model}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
               />
               <Input
                    name="nickName"
                    placeholder={"Lempinimi"}
                    label="Lempinimi"
                    type="text"
                    maxLength={20}
                    value={formData.nickName}
                    onChange={handleInputChange}
               />
               <Input
                    name="registerNumber"
                    placeholder={"ABC-123"}
                    label="Rekisteritunnus"
                    type="text"
                    maxLength={7}
                    value={formData.registerNumber}
                    onChange={handleInputChange}
               />
               <Select
                    name="primaryFuel"
                    label="Polttoaine"
                    options={fuelTypes}
                    value={formData.primaryFuel}
                    onChange={handleSelectChange}
               />
               <DatePicker
                    name="registeringDateString"
                    label="Rekisteröintipäivä"
                    dateValue={formData.registeringDateString ?? ""}
                    max={DateTime.now().toISODate() as string}
                    onChange={handleInputChange}
               />
               <DatePicker
                    name="inUseFromString"
                    label="Käyttöönottopäivä"
                    dateValue={formData.inUseFromString ?? ""}
                    max={DateTime.now().toISODate() as string}
                    onChange={handleInputChange}
               />
               {purpose === "modify" ? (
                    <Switch
                         name="active"
                         label="Aktiivinen / pois käytöstä"
                         checked={formData.active}
                         onChange={handleInputChange}
                    />
               ) : null}
               <Input
                    name="imageUrl"
                    placeholder={"https://..."}
                    label="Linkki kuvaan"
                    type="text"
                    value={formData.imageUrl ?? ""}
                    onChange={handleInputChange}
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
