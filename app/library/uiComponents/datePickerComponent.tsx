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
                    className="px-2 py-1 text-sm"
               >
                    {label}
               </label>
               <input
                    {...defaultProps}
                    id={defaultProps.name}
                    type="date"
                    className="rounded-md pl-2 text-lg"
                    value={dateValue}
               />
          </div>
     );
}
