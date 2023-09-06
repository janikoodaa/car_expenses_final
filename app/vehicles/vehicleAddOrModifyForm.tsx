"use client";
import Select, { ISelectOption } from "../library/uiComponents/selectComponent";
import Input from "../library/uiComponents/inputComponent";
import { DateTime } from "luxon";
import DatePicker from "../library/uiComponents/datePickerComponent";
import Button from "../library/uiComponents/buttonComponent";
import Image from "next/image";
import { IVehicle, VehicleWithTypes } from "../library/models/Vehicle";
import { ChangeEvent, useEffect, useState } from "react";
import Switch from "../library/uiComponents/switchComponent";
import { VehicleType } from "../library/models/VehicleType";
import IDataResponse from "@/types/dataResponse";

export interface IVehicleForm
     extends Omit<IVehicle, "ownerId" | "inUseFrom" | "registeringDate" | "inUseTo" | "inUseToString" | "owner" | "registerNumber"> {
     inUseFromString: string;
     registeringDateString: string;
}

interface IVehicleFormProps {
     purpose: "add" | "modify";
     vehicle?: string;
     closeModal?: () => void;
}

const emptyVehicle: IVehicleForm = {
     make: "",
     model: "",
     // typeId: undefined,
     type: { typeDef: "", typeDescription: "" },
     nickName: "",
     inUseFromString: "",
     // primaryFuelId: undefined,
     primaryFuel: { typeDef: "", typeDescription: "" },
     registeringDateString: "",
     year: 0,
     registerNumberPlain: "",
     active: true,
     imageUrl: "",
     coUserIds: [],
};

export default function AddOrModifyVechile({ purpose, closeModal, vehicle }: IVehicleFormProps): JSX.Element {
     const v: VehicleWithTypes | null = vehicle
          ? JSON.parse(vehicle, (key, value) => {
                 //   console.log(`revive key: ${key} typeof key: ${typeof key} & value: ${value} typeof value ${typeof value}`);
                 //   if (key === ("registeringDate" || "inUseFrom" || "inUseTo") && value !== "") return new Date(value);
                 if (key === "registeringDate" && value) return new Date(value);
                 if (key === "registeringDate" && !value) return null;
                 //   if (key === "registeringDate" && value !== "") return new Date(value);
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
                 //   typeId: v.typeId._id,
                 type: v.type || { typeDef: "", typeDescription: "" },
                 //   primaryFuelId: v.primaryFuelId?._id,
                 primaryFuel: v.primaryFuel || { typeDef: "", typeDescription: "" },
            } as Omit<IVehicleForm, "inUseFrom" | "registeringDate" | "inUseTo" | "owner">)
          : null;
     const [isLoading, setIsLoading] = useState<boolean>(false);
     const [formData, setFormData] = useState<Omit<IVehicleForm, "inUseFrom" | "registeringDate" | "inUseTo" | "owner">>(
          vehicleToModify ?? emptyVehicle
     );
     const [vehicleTypes, setVehicleTypes] = useState<ISelectOption[]>([{ value: undefined, description: "Ei valittu" }]);
     const [fuelTypes, setFuelTypes] = useState<ISelectOption[]>([{ value: undefined, description: "Ei valittu" }]);

     useEffect(() => {
          setIsLoading(true);
          const controller = new AbortController();
          const signal = controller.signal;

          const getVehicleTypes = async () => {
               try {
                    const res = await fetch("/api/vehicle/type", { method: "GET", signal: signal });
                    const json: IDataResponse<VehicleType[]> = await res.json();
                    // console.log("vehicleTypes json: ", json);
                    if (json.data) {
                         json.data.map((type) => {
                              setVehicleTypes((prev) => [...prev, { value: type.typeDef, description: type.typeDescription }]);
                         });
                    }
               } catch (error) {
                    console.log("Virhe ajoneuvotyyppejä haettaessa: ", error);
               }
          };
          const getFuelTypes = async () => {
               try {
                    const res = await fetch("/api/vehicle/fuel", { method: "GET", signal: signal });
                    const json: IDataResponse<VehicleType[]> = await res.json();
                    // console.log("fuelTypes json: ", json);
                    if (json.data) {
                         json.data.map((type) => {
                              setFuelTypes((prev) => [...prev, { value: type.typeDef, description: type.typeDescription }]);
                         });
                    }
               } catch (error) {
                    console.log("Virhe polttoainetyyppejä haettaessa: ", error);
               }
          };

          getVehicleTypes();
          getFuelTypes();
          setIsLoading(false);

          return () => {
               controller.abort();
          };
     }, []);

     const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
          console.log(`handleFormChange e.target.name: ${e.target.name} and e.target.value: ${e.target.value}`);
          if (e.target.name === "vehicleType") {
               setFormData((prev) => ({
                    ...prev,
                    type: { typeDef: e.target.value, typeDescription: "" },
               }));
          } else if (e.target.name === "primaryFuelType") {
               setFormData((prev) => ({
                    ...prev,
                    primaryFuel: { typeDef: e.target.value, typeDescription: "" },
               }));
          } else {
               setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
          }
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
          setIsLoading(true);
          if (purpose === "add") {
               console.log("New vehicle form data: ", formData);
               if (formData.type.typeDef !== undefined) {
                    const res = await fetch(endpoint, {
                         method: "POST",
                         body: JSON.stringify(formData),
                         headers: { "Content-Type": "application/json" },
                    });
                    //    console.log("Submit res: ", res);
                    const json = await res.json();
                    console.log("Submit json: ", json);
                    setIsLoading(false);
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
               setIsLoading(false);
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
                    name="vehicleType"
                    label="Tyyppi"
                    disabled={isLoading}
                    options={vehicleTypes}
                    value={formData.type.typeDef}
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
                    name="registerNumberPlain"
                    placeholder={"ABC-123"}
                    label="Rekisteritunnus"
                    type="text"
                    maxLength={7}
                    value={formData.registerNumberPlain}
                    onChange={handleInputChange}
               />
               <Select
                    name="primaryFuelType"
                    label="Polttoaine"
                    disabled={isLoading}
                    options={fuelTypes}
                    value={formData.primaryFuel.typeDef}
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
                         disabled={isLoading}
                         onClick={resetAndCloseModal}
                    />
                    <Button
                         type="submit"
                         buttonText={!isLoading ? "Tallenna" : "Tallentaa"}
                         variant="primary"
                         disabled={isLoading}
                         onClick={handleSubmit}
                    />
               </div>
          </form>
     );
}
