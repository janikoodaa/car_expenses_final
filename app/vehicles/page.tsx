import GrantedVehiclesSection from "./grantedVehiclesCard";
import OwnedVehiclesSection from "./ownedVehiclesCard";
import RetiredVehiclesSection from "./retiredVehiclesCard";

export const metadata = {
     title: "Kul(k)upeli - ajoneuvot",
     description: "Listaus käyttäjän käytössä olevista ajoneuvoista.",
};

export default function VehiclesPage(): JSX.Element {
     return (
          <div className="pb-10">
               <OwnedVehiclesSection />
               <GrantedVehiclesSection />
               <RetiredVehiclesSection />
          </div>
     );
}
