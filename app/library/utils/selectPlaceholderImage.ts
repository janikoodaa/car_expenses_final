import CarImage from "@/public/images/placeholderImageTypeCar.png";
import VanImage from "@/public/images/placeholderImageTypeVan.png";
import TruckImage from "@/public/images/placeholderImageTypeTruck.png";
import TractorImage from "@/public/images/placeholderImageTypeTractor.png";
import MotorcycleImage from "@/public/images/placeholderImageTypeMotorcycle.png";
import BicycleImage from "@/public/images/placeholderImageTypeBicycle.png";
import { StaticImageData } from "next/image";

export default function selectPlaceholderImage(vehicleType: string): StaticImageData {
     switch (vehicleType) {
          case "van":
               return VanImage;
          case "truck":
               return TruckImage;
          case "tractor":
               return TractorImage;
          case "motorcycle":
               return MotorcycleImage;
          case "bicycle":
               return BicycleImage;
          default:
               return CarImage;
     }
}
