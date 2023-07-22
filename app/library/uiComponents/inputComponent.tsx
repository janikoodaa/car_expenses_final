"use client";

import { InputHTMLAttributes } from "react";

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
     label: string;
}

export default function Input({ label, ...defaultProps }: IInputProps) {
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
                    disabled={defaultProps.type === "file"}
                    className={`rounded-md px-2 py-1 text-lg file:h-8 file:rounded-md file:bg-neutral-500 file:text-center file:text-base file:text-white file:shadow-md file:shadow-gray-600 file:focus:shadow-sm ${defaultProps.className}`}
                    value={defaultProps.type === "number" && defaultProps.value === 0 ? "" : defaultProps.value}
               />
          </div>
     );
}
