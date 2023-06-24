import OwnedVehiclesSection from "../library/uiComponents/ownedVehiclesCard";
// import VehicleModal from "../library/uiComponents/vehicleModal";

export default function Cars(): JSX.Element {
     return (
          <>
               <div className="mx-2 my-2 rounded-lg bg-slate-400 px-2 py-2">
                    <OwnedVehiclesSection />
               </div>
               {/* <VehicleModal /> */}
          </>
     );
}
