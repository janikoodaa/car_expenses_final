"use client";

import { ChangeEvent, useState } from "react";
import Modal from "./modalComponent";
import Button from "./buttonComponent";
import { VehicleEventDTO } from "../models/Event";
import { DateTime } from "luxon";
import { IVehicle } from "../models/Vehicle";
import DatePicker from "./datePickerComponent";
import Input from "./inputComponent";
import Select, { ISelectOption } from "./selectComponent";
import { EventType } from "../models/EventType";

interface VehicleEventForm extends Omit<VehicleEventDTO, "createdBy"> {
     eventDateString: string;
     eventTimeHours: number;
     eventTimeMinutes: number;
}

const emptyVehicleEvent: VehicleEventForm = {
     vehicle: "",
     eventType: { typeDef: "", typeDescription: "" },
     eventDateTime: DateTime.now().toJSDate(),
     eventDateString: DateTime.now().toISODate() as string,
     eventTimeHours: 12,
     eventTimeMinutes: 0,
     fuelType: { typeDef: "", typeDescription: "" },
     mileage: 0,
     refuelAmount: 0,
     pricePerLiter: 0,
     totalPrice: 0,
     noteText: "",
};

// Create values for time picker selects
const HOURS: ISelectOption[] = new Array();
for (let i = 0; i < 24; i++) {
     HOURS.push({ value: i, description: i.toString() });
}

const MINUTES: ISelectOption[] = new Array();
for (let i = 0; i < 60; i += 15) {
     MINUTES.push({ value: i, description: i >= 10 ? i.toString() : `0${i.toString()}` });
}

export default function AddNewEvent({ vehicles, eventTypes }: { vehicles: string; eventTypes: string }): JSX.Element {
     const [showOptions, setShowOptions] = useState<boolean>(false);
     const [showAddRefuelModal, setShowAddRefuelModal] = useState<boolean>(false);
     const [showAddEventModal, setShowAddEventModal] = useState<boolean>(false);
     const [isLoading, setIsLoading] = useState<boolean>(false);
     const [eventFormData, setEventFormData] = useState<VehicleEventForm>(emptyVehicleEvent);

     const availableVehicles: IVehicle[] = JSON.parse(vehicles);

     const refuellableVehicleOptions: ISelectOption[] = new Array();
     refuellableVehicleOptions.push({ value: "", description: "Ei valittu" });
     availableVehicles.forEach((v) => {
          if (v.primaryFuel.typeDef !== "no-fuel") {
               refuellableVehicleOptions.push({ value: v._id?.toString(), description: `${v.make} ${v.model}` });
          }
     });

     const allVehicleOptions: ISelectOption[] = new Array();
     allVehicleOptions.push({ value: "", description: "Ei valittu" });
     availableVehicles.map((v) => {
          allVehicleOptions.push({ value: v._id?.toString(), description: `${v.make} ${v.model}` });
     });

     const events: EventType[] = JSON.parse(eventTypes);

     const eventOptions: ISelectOption[] = new Array();
     eventOptions.push({ value: "", description: "Ei valittu" });
     events.forEach((e) => {
          if (e.typeDef !== "refuel") {
               eventOptions.push({ value: e.typeDef, description: e.typeDescription });
          }
     });

     const toggleOptionsVisibility = () => {
          setShowOptions((prev) => !prev);
     };

     const handleAddRefuel = () => {
          setShowOptions(false);
          setEventFormData({ ...emptyVehicleEvent, eventType: { typeDef: "refuel", typeDescription: "tankkaus" } });
          setShowAddRefuelModal(true);
     };

     const handleAddOtherEvent = () => {
          setShowOptions(false);
          setShowAddEventModal(true);
     };

     const cancelAddRefuel = () => {
          setEventFormData(emptyVehicleEvent);
          // setRefuelFormData(emptyRefuel);
          setShowAddRefuelModal(false);
     };

     const cancelAddEvent = () => {
          setEventFormData(emptyVehicleEvent);
          // setEventFormData(emptyEvent);
          setShowAddEventModal(false);
     };

     const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
          // console.log(`handleFormChange e.target.name: ${e.target.name} and e.target.value: ${e.target.value}`);
          if (showAddRefuelModal && e.target.name === "vehicle") {
               availableVehicles.forEach((v) => {
                    if (v._id?.toString() === e.target.value) {
                         setEventFormData((prev) => ({
                              ...prev,
                              [e.target.name]: e.target.value,
                              fuelType: { typeDef: v.primaryFuel.typeDef, typeDescription: v.primaryFuel.typeDescription },
                         }));
                    }
               });
          } else if (showAddRefuelModal) {
               setEventFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
               // setRefuelFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
          }

          if (showAddEventModal && e.target.name !== "eventType") {
               setEventFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
          }
          if (showAddEventModal && e.target.name === "eventType") {
               events.forEach((event) => {
                    if (event.typeDef === e.target.value) {
                         setEventFormData((prev) => ({
                              ...prev,
                              [e.target.name]: { typeDef: e.target.value, typeDescription: event.typeDescription },
                         }));
                    }
               });
          }
     };

     const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          // console.log(`handleFormChange e.target.name: ${e.target.name} and e.target.value: ${e.target.value}`);
          setEventFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
     };

     const handleSubmit = async (e: any) => {
          e.preventDefault();
          const endpoint: string = "/api/event";
          setIsLoading(true);
          // TODO: data needs to be validated before posting and needs better way to decide, if it's general event or refuel.

          const dataToPost: Omit<VehicleEventDTO, "createdBy"> =
               eventFormData.eventType.typeDef === "refuel"
                    ? {
                           vehicle: eventFormData.vehicle,
                           eventType: { typeDef: eventFormData.eventType.typeDef, typeDescription: eventFormData.eventType.typeDescription },
                           eventDateTime: DateTime.fromISO(eventFormData.eventDateString, { zone: "local" })
                                .set({ hour: eventFormData.eventTimeHours, minute: eventFormData.eventTimeMinutes })
                                .toJSDate(),
                           fuelType: { typeDef: eventFormData.fuelType!.typeDef, typeDescription: eventFormData.fuelType!.typeDescription },
                           mileage: eventFormData.mileage,
                           refuelAmount: eventFormData.refuelAmount,
                           totalPrice: eventFormData.totalPrice,
                           pricePerLiter: eventFormData.pricePerLiter,
                           noteText: eventFormData.noteText,
                      }
                    : {
                           vehicle: eventFormData.vehicle,
                           eventType: { typeDef: eventFormData.eventType.typeDef, typeDescription: eventFormData.eventType.typeDescription },
                           eventDateTime: DateTime.fromISO(eventFormData.eventDateString, { zone: "local" }).startOf("day").toJSDate(),
                           mileage: eventFormData.mileage,
                           totalPrice: eventFormData.totalPrice,
                           noteText: eventFormData.noteText,
                      };

          console.log("New event, dataToPost: ", dataToPost);
          const res = await fetch(endpoint, {
               method: "POST",
               body: JSON.stringify(dataToPost),
               headers: { "Content-Type": "application/json" },
          });
          console.log("Submit res: ", res);
          setIsLoading(false);
          if (res.status === 201) {
               showAddEventModal && setShowAddEventModal(false);
               showAddRefuelModal && setShowAddRefuelModal(false);
          }
          const json = await res.json();
          console.log("Submit json: ", json);
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
                         <div className="overflow-y-auto pb-4 pt-2">
                              <form
                                   className="mx-8 flex flex-col gap-2"
                                   onSubmit={handleSubmit}
                              >
                                   <Select
                                        name="vehicle"
                                        label="Ajoneuvo"
                                        options={refuellableVehicleOptions}
                                        value={eventFormData.vehicle}
                                        onChange={handleSelectChange}
                                   />
                                   <Input
                                        name="mileage"
                                        placeholder={"km"}
                                        required
                                        label="Mittarilukema"
                                        type="number"
                                        maxLength={20}
                                        value={eventFormData.mileage}
                                        onChange={handleInputChange}
                                   />
                                   <Input
                                        name="refuelAmount"
                                        placeholder={"Litraa"}
                                        required
                                        label="Määrä"
                                        type="number"
                                        min={0}
                                        step={0.01}
                                        value={eventFormData.refuelAmount}
                                        onChange={handleInputChange}
                                   />
                                   <Input
                                        name="pricePerLiter"
                                        placeholder={"€"}
                                        required
                                        label="Litrahinta"
                                        type="number"
                                        min={0}
                                        step={0.001}
                                        value={eventFormData.pricePerLiter}
                                        onChange={handleInputChange}
                                   />
                                   <Input
                                        name="totalPrice"
                                        placeholder={"€"}
                                        required
                                        label="Kokonaishinta"
                                        type="number"
                                        min={0}
                                        step={0.01}
                                        value={eventFormData.totalPrice}
                                        onChange={handleInputChange}
                                   />
                                   <div className="grid w-full grid-cols-4 gap-2">
                                        <div className="col-span-2">
                                             <DatePicker
                                                  name="eventDateString"
                                                  label="Päivä ja aika"
                                                  dateValue={eventFormData.eventDateString ?? ""}
                                                  max={DateTime.now().toISODate() as string}
                                                  onChange={handleInputChange}
                                             />
                                        </div>
                                        <Select
                                             className="col-span-1"
                                             name="eventTimeHours"
                                             label="hh"
                                             value={eventFormData.eventTimeHours}
                                             options={HOURS}
                                             onChange={handleSelectChange}
                                        />
                                        <Select
                                             className="col-span-1"
                                             name="eventTimeMinutes"
                                             label="min"
                                             value={eventFormData.eventTimeMinutes}
                                             options={MINUTES}
                                             onChange={handleSelectChange}
                                        />
                                   </div>
                                   <div className="flex flex-col">
                                        <label
                                             htmlFor={"noteText"}
                                             className="pl-2 text-sm"
                                        >
                                             {"Muistiinpano"}
                                        </label>
                                        <textarea
                                             className={`rounded-md px-2 py-1 text-lg`}
                                             name="noteText"
                                             placeholder="Muistiinpano"
                                             value={eventFormData.noteText}
                                             rows={3}
                                             required
                                             maxLength={500}
                                             onChange={handleInputChange}
                                        />
                                   </div>
                                   <hr />
                                   <div className="flex w-full columns-2 flex-row justify-evenly gap-4">
                                        <Button
                                             type="button"
                                             buttonText="Peruuta"
                                             variant="secondary"
                                             disabled={isLoading}
                                             onClick={cancelAddRefuel}
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
                         </div>
                    </Modal>
               ) : null}
               {showAddEventModal ? (
                    <Modal headerText="Lisää muu tapahtuma">
                         <div className="overflow-y-auto pb-4 pt-2">
                              <form
                                   className="mx-8 flex flex-col gap-2"
                                   onSubmit={handleSubmit}
                              >
                                   <Select
                                        name="eventType"
                                        label="Tapahtuma"
                                        options={eventOptions}
                                        value={eventFormData.eventType.typeDef}
                                        onChange={handleSelectChange}
                                   />
                                   <Select
                                        name="vehicle"
                                        label="Ajoneuvo"
                                        options={allVehicleOptions}
                                        value={eventFormData.vehicle}
                                        onChange={handleSelectChange}
                                   />
                                   <Input
                                        name="mileage"
                                        placeholder={"km"}
                                        required
                                        label="Mittarilukema"
                                        type="number"
                                        maxLength={20}
                                        value={eventFormData.mileage}
                                        onChange={handleInputChange}
                                   />
                                   <Input
                                        name="totalPrice"
                                        placeholder={"€"}
                                        required
                                        label="Kokonaishinta"
                                        type="number"
                                        min={0}
                                        step={0.01}
                                        value={eventFormData.totalPrice}
                                        onChange={handleInputChange}
                                   />
                                   <DatePicker
                                        name="eventDateString"
                                        label="Päivä"
                                        dateValue={eventFormData.eventDateString ?? ""}
                                        max={DateTime.now().toISODate() as string}
                                        onChange={handleInputChange}
                                   />
                                   <div className="flex flex-col">
                                        <label
                                             htmlFor={"noteText"}
                                             className="pl-2 text-sm"
                                        >
                                             {"Muistiinpano"}
                                        </label>
                                        <textarea
                                             className={`rounded-md px-2 py-1 text-lg`}
                                             name="noteText"
                                             placeholder="Muistiinpano"
                                             value={eventFormData.noteText}
                                             rows={3}
                                             required
                                             maxLength={500}
                                             onChange={handleInputChange}
                                        />
                                   </div>
                                   <hr />
                                   <div className="flex w-full columns-2 flex-row justify-evenly gap-4">
                                        <Button
                                             type="button"
                                             buttonText="Peruuta"
                                             variant="secondary"
                                             disabled={isLoading}
                                             onClick={cancelAddEvent}
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
                         </div>
                    </Modal>
               ) : null}
          </>
     );
}
