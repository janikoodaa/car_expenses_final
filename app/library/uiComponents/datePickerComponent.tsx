"use client";

import { InputHTMLAttributes } from "react";

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
     label: string;
     dateValue: string;
}

export default function DatePicker({ label, dateValue, ...defaultProps }: IInputProps) {
     //  console.log("...defautProps: ", defaultProps);

     return (
          <div className="flex flex-col">
               <label
                    htmlFor={defaultProps.name}
                    className="pl-2 text-sm"
               >
                    {label}
               </label>
               <input
                    {...defaultProps}
                    id={defaultProps.name}
                    type="date"
                    className="h-9 rounded-md px-2 py-1 text-lg"
                    value={dateValue}
               />
          </div>
     );
}
