"use client";

import { InputHTMLAttributes } from "react";

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
     label: string;
     dateValue: Date;
}

export default function DatePicker({ label, ...defaultProps }: IInputProps) {
     //  console.log("...defautProps: ", defaultProps);
     const year: string = new Date(defaultProps.dateValue).getFullYear().toString();
     const month: number = new Date(defaultProps.dateValue).getMonth() + 1;
     const date: number = new Date(defaultProps.dateValue).getDate();
     const monthString: string = month < 10 ? `0${month.toString()}` : month.toString();
     const dateString: string = date < 10 ? `0${date.toString()}` : date.toString();
     const ISODateString = `${year}-${monthString}-${dateString}`;

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
                    type="date"
                    className="rounded-md pl-2 text-lg"
                    value={ISODateString}
                    onChange={defaultProps.onChange}
               />
          </div>
     );
}
