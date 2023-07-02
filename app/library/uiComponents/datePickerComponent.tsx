"use client";

import { InputHTMLAttributes } from "react";

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
     label: string;
     dateValue: Date;
}

export default function DatePicker({ label, dateValue, ...defaultProps }: IInputProps) {
     //  console.log("...defautProps: ", defaultProps);
     const year: string = new Date(dateValue).getFullYear().toString();
     const month: number = new Date(dateValue).getMonth() + 1;
     const date: number = new Date(dateValue).getDate();
     const monthString: string = month < 10 ? `0${month.toString()}` : month.toString();
     const dateString: string = date < 10 ? `0${date.toString()}` : date.toString();
     const ISODateString = `${year}-${monthString}-${dateString}`;

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
                    value={ISODateString}
               />
          </div>
     );
}
