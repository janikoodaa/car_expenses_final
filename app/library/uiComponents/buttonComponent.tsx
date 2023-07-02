import { ButtonHTMLAttributes } from "react";

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
     buttonText: string;
     variant?: "primary" | "secondary";
}

export default function Button({ buttonText, variant, ...defaultProps }: IButtonProps) {
     return (
          <button
               {...defaultProps}
               className={`${defaultProps.className} h-8 w-32 rounded-md text-center  shadow-md  focus:shadow-sm ${
                    variant === "primary"
                         ? "border-2 border-green-100 border-opacity-50 bg-green-700 text-green-100 shadow-gray-600 hover:bg-green-600"
                         : variant === "secondary"
                         ? "border-2 border-green-700 border-opacity-50 bg-transparent text-green-700"
                         : ""
               } `}
          >
               {buttonText}
          </button>
     );
}
