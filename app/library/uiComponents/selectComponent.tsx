"use client";

import { SelectHTMLAttributes } from "react";

interface ISelectOption {
     value: number | string | undefined;
     description: string;
}

interface ISelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
     options: ISelectOption[];
     label: string;
}

export default function Select({ label, options, ...defaultProps }: ISelectProps) {
     return (
          <div className="flex flex-col">
               <label
                    htmlFor={defaultProps.name}
                    className="pl-2 text-sm"
               >
                    {label}
               </label>
               <select
                    id={defaultProps.name}
                    name={defaultProps.name}
                    className="rounded-md pl-2 text-lg"
                    value={defaultProps.value}
                    onChange={defaultProps.onChange}
               >
                    {options.map((opt) => {
                         return (
                              <option
                                   key={opt.value || "undefined"}
                                   value={opt.value}
                              >
                                   {opt.description}
                              </option>
                         );
                    })}
               </select>
          </div>
     );
}
