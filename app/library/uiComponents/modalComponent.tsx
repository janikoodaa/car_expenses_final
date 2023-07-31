interface IModalProps {
     headerText: string;
     children: React.ReactNode;
}

export default function Modal({ headerText, children }: IModalProps): JSX.Element {
     return (
          <div className="fixed inset-0 z-30 h-full w-full overflow-y-auto backdrop-blur">
               <div className="flex h-full w-full items-center justify-center">
                    <div className="z-40 flex h-4/5 flex-col rounded-md border-2 border-solid border-slate-600 bg-slate-300 shadow-md md:w-3/4 lg:w-1/2">
                         <div className="flex w-full rounded-t-sm bg-slate-400 px-4 py-2 font-bold">
                              <h1>{headerText}</h1>
                         </div>
                         {children}
                    </div>
               </div>
          </div>
     );
}
