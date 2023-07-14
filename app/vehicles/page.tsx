import GrantedVehiclesSection from "./grantedVehiclesCard";
import OwnedVehiclesSection from "./ownedVehiclesCard";
import RetiredVehiclesSection from "./retiredVehiclesCard";

export default function VehiclesPage(): JSX.Element {
     return (
          <>
               <OwnedVehiclesSection />
               <GrantedVehiclesSection />
               <RetiredVehiclesSection />
          </>
     );
}
