import { InputHTMLAttributes } from "react";

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
     label: string;
}

export default function Switch({ label, checked, ...defaultProps }: IInputProps): JSX.Element {
     return (
          <>
               <label>
                    {label}
                    <input
                         {...defaultProps}
                         type="checkbox"
                         checked={checked}
                    />
               </label>
          </>
     );
}
