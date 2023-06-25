"use client";

import { InputHTMLAttributes } from "react";

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
     label: string;
}

export default function Input({ label, ...defaultProps }: IInputProps) {
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
                    id={defaultProps.name}
                    name={defaultProps.name}
                    type={defaultProps.type}
                    className="rounded-md pl-2 text-lg"
                    value={defaultProps.value}
                    onChange={defaultProps.onChange}
               />
          </div>
     );
}
