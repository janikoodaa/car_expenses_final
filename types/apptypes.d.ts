interface UserFromGraph {
     givenName: string | null;
     surname: string | null;
     initials: string | null;
     theme: "light" | "dark";
}

interface AppUser {
     _id?: any;
     aadObjectId: string;
     aadUsername: string;
}

interface Vehicle {
     _id: any;
     type: "car" | "bicycle" | "motorcycle" | "van";
     make: string;
     model: string;
     year: number;
     registeringDate: Date;
     fuel: "95E10" | "Diesel";
     active: boolean;
     owner: string;
     coUsers: string[] | null;
}

interface DataResponse<T> {
     status: "ok" | "error";
     data: T | undefined | null;
     error?: any;
}
