interface AppUser {
     _id?: any;
     aadObjectId: string;
     aadUsername: string;
     givenName: string | null;
     surname: string | null;
     initials: string | null;
     theme: "light" | "dark";
}

interface Vehicle {
     _id: any;
     type: "car" | "bicycle" | "motorcycle" | "van";
     make: string;
     model: string;
     nickName: string | null;
     year: number;
     registeringDate: Date;
     registerNumber: string;
     inUseFrom: Date;
     InUseTo: Date;
     primaryFuel: "95E10" | "98E5" | "Diesel" | null;
     active: boolean;
     owner: string;
     coUsers: string[] | null;
     image: string | "";
}

interface DataResponse<T> {
     status: "ok" | "error";
     data: T | undefined | null;
     error?: any;
}
