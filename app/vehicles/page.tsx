import GrantedVehiclesSection from "../library/uiComponents/grantedVehiclesCard";
import OwnedVehiclesSection from "../library/uiComponents/ownedVehiclesCard";
import RetiredVehiclesSection from "../library/uiComponents/retiredVehiclesCard";

export default function VehiclesPage(): JSX.Element {
     return (
          <>
               <OwnedVehiclesSection />
               <GrantedVehiclesSection />
               <RetiredVehiclesSection />
          </>
     );
}
