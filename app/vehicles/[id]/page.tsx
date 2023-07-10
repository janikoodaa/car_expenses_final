import { authOptions } from "@/app/configuration/authOptions";
import { IAppUser } from "@/app/library/models/User";
import { IVehicle } from "@/app/library/models/Vehicle";
import { getVehicleById } from "@/app/library/mongoDB/vehicleData";
import Button from "@/app/library/uiComponents/buttonComponent";
import IDataResponse from "@/types/dataResponse";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { MdDeleteOutline } from "react-icons/md";

export default async function SingleVehiclePage({ params }: { params: { id: string } }) {
     const session = await getServerSession(authOptions);
     const vehicleId = params.id;
     if (!session) return null;

     const response: IDataResponse<IVehicle> = await getVehicleById(vehicleId, session.user._id!);
     console.log("vehicle page response: ", response);

     if (response.status === "ok" && response.data) {
          const vehicle: IVehicle = response.data;
          const owner = response.data.owner as IAppUser;
          const coUsers = response.data.coUsers as IAppUser[];
          return (
               <>
                    <div className=" grid grid-cols-1 items-center justify-items-center gap-2 px-2 py-2 lg:grid-cols-2">
                         <table className="order-2 col-span-1 w-full lg:order-1">
                              <tbody>
                                   <tr className="h-9 border-b border-b-gray-400">
                                        <th className="w-1/2 px-2 text-right">Merkki</th>
                                        <td className="w-1/2 px-2 text-center">{vehicle.make}</td>
                                   </tr>
                                   <tr className="h-9 border-b border-b-gray-400">
                                        <th className="w-1/2 px-2 text-right">Malli</th>
                                        <td className="w-1/2 px-2 text-center">{vehicle.model}</td>
                                   </tr>
                                   <tr className="h-9 border-b border-b-gray-400">
                                        <th className="w-1/2 px-2 text-right">Vuosimalli</th>
                                        <td className="w-1/2 px-2 text-center">{vehicle.year}</td>
                                   </tr>
                                   <tr className="h-9 border-b border-b-gray-400">
                                        <th className="w-1/2 px-2 text-right">Käytössä alkaen</th>
                                        <td className="w-1/2 px-2 text-center">{vehicle.inUseFrom.toLocaleDateString("fi")}</td>
                                   </tr>
                                   {vehicle.InUseTo ? (
                                        <tr className="h-9 border-b border-b-gray-400">
                                             <th className="w-1/2 px-2 text-right">Käytöstä poisto</th>
                                             <td className="w-1/2 px-2 text-center">{vehicle.InUseTo.toLocaleDateString("fi")}</td>
                                        </tr>
                                   ) : null}
                                   <tr className="h-9 border-b border-b-gray-400">
                                        <th className="w-1/2 px-2 text-right">Polttoaine</th>
                                        <td className="w-1/2 px-2 text-center">{vehicle.primaryFuel}</td>
                                   </tr>
                                   {vehicle.registerNumber ? (
                                        <tr className="h-9 border-b border-b-gray-400">
                                             <th className="w-1/2 px-2 text-right">Rekisteritunnus</th>
                                             <td className="w-1/2 px-2 text-center">{vehicle.registerNumber}</td>
                                        </tr>
                                   ) : null}
                                   {vehicle.registeringDate ? (
                                        <tr className="h-9 border-b border-b-gray-400">
                                             <th className="w-1/2 px-2 text-right">Rekisteröintipäivä</th>
                                             <td className="w-1/2 px-2 text-center">{vehicle.registeringDate?.toLocaleDateString("fi")}</td>
                                        </tr>
                                   ) : null}
                              </tbody>
                         </table>
                         {vehicle.imageUrl ? (
                              <Image
                                   src={encodeURI(vehicle.imageUrl)}
                                   alt={`${vehicle.make} ${vehicle.model}`}
                                   width={600}
                                   height={400}
                                   style={{ maxWidth: "80%", height: "auto" }}
                                   priority
                                   className="order-1 col-span-1 rounded-md lg:order-2"
                              />
                         ) : null}
                    </div>
                    <div className="grid w-full grid-cols-1 p-2">
                         <h2 className="rounded-t-md bg-slate-500 p-2 font-bold text-slate-100">Ajoneuvon omistaja</h2>
                         <table className="mb-4">
                              <thead>
                                   <tr>
                                        <th className="w-1/2 px-2 text-right">Nimi</th>
                                        <th className="w-1/2 px-2 text-left">Sähköposti</th>
                                   </tr>
                              </thead>
                              <tbody>
                                   <tr>
                                        <td className="px-2 text-right">
                                             {owner.givenName} {owner.surname}
                                        </td>
                                        <td className="px-2 text-left">{owner.aadUsername}</td>
                                   </tr>
                              </tbody>
                         </table>

                         <h2 className="rounded-t-md bg-slate-500 p-2 font-bold text-slate-100">Ajoneuvon muut käyttäjät ({coUsers.length})</h2>
                         {coUsers.length ? (
                              <table className="mb-4">
                                   <thead>
                                        <tr>
                                             <th className="min-w-1/2 px-2 text-right">Nimi</th>
                                             <th className="w-1/2 px-2 text-left">Sähköposti</th>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        {coUsers.map((cu, idx) => {
                                             return (
                                                  <tr>
                                                       <td
                                                            key={idx}
                                                            className="w-1/2 px-2 text-right"
                                                       >
                                                            {cu.givenName} {cu.surname}
                                                       </td>
                                                       <td className="w-1/2 px-2 text-left">{cu.aadUsername}</td>
                                                       <td className="px-2 text-center">
                                                            {/* TODO: buttonista tehtävä client component ja siihen varmistusmodaali ennen poistoa */}
                                                            <button className="text-xl text-red-600">
                                                                 <MdDeleteOutline />
                                                            </button>
                                                       </td>
                                                  </tr>
                                             );
                                        })}
                                   </tbody>
                              </table>
                         ) : null}
                         {/* TODO: buttoneista tehtävä client component ja siihen varmistusmodaali ennen poistoa ja muokkausmodaali muokkaamista varten */}
                         {owner._id?.toString() === session.user._id ? (
                              <>
                                   <hr />
                                   <div className="mt-2 flex flex-row justify-center gap-2">
                                        <Button
                                             className="bg-red-600 text-slate-100"
                                             buttonText="Poista käytöstä"
                                        />
                                        <Button
                                             className="bg-slate-500 text-slate-100"
                                             buttonText="Muokkaa"
                                        />
                                   </div>
                              </>
                         ) : null}
                    </div>
               </>
          );
     }

     return <div>Virhe</div>;
}
