import { ButtonHTMLAttributes, HTMLAttributes } from "react";

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
     buttonText: string;
     variant?: "primary" | "secondary" | "warning" | undefined;
}

function classesByVariant({ variant }: Pick<IButtonProps, "variant">): string {
     let classes: string;
     switch (variant) {
          case "primary":
               classes = "border-2 border-green-100 border-opacity-50 bg-green-700 text-green-100 shadow-gray-600 hover:bg-green-600";
               break;
          case "secondary":
               classes = "border-2 border-green-700 border-opacity-50 bg-transparent text-green-700 hover:bg-green-200";
               break;
          case "warning":
               classes = "border-2 border-red-100 border-opacity-50 bg-red-700 text-red-100 shadow-gray-600 hover:bg-red-600";
               break;
          default:
               classes = "";
               break;
     }
     return classes;
}

export default function Button({ buttonText, variant, ...defaultProps }: IButtonProps) {
     return (
          <button
               {...defaultProps}
               className={`${defaultProps.className} h-8 w-32 rounded-md text-center shadow-md focus:shadow-sm ${classesByVariant({ variant })} `}
          >
               {buttonText}
          </button>
     );
}
