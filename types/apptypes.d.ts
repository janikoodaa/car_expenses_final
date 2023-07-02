interface IAppUser {
     _id?: any;
     aadObjectId: string;
     aadUsername: string;
     givenName: string | null;
     surname: string | null;
     initials: string | null;
     theme: "light" | "dark";
}

interface IVehicle {
     _id: any;
     type: "car" | "bicycle" | "motorcycle" | "van";
     make: string;
     model: string;
     nickName: string;
     year: number;
     registeringDate: Date;
     registerNumber: string;
     inUseFrom: Date;
     InUseTo: Date;
     primaryFuel: "95E10" | "98E5" | "Diesel";
     active: boolean;
     owner: Partial<IAppUser>[];
     coUsers: Partial<IAppUser>[] | null;
     image: string | "";
}

interface IDataResponse<T> {
     status: "ok" | "error";
     data: T | undefined | null;
     error?: any;
}

interface ILink {
     path: string;
     description: string;
}
