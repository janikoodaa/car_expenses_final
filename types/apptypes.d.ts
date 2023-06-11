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

interface DataResponse {
     status: "ok" | "error";
     data: {} | null;
     error?: any;
}

interface GraphResponse extends DataResponse {
     data: UserFromGraph | null;
}

interface UserCheckResponse extends DataResponse {
     data: { isExistingUser: boolean } | null;
}

interface UserResponse extends DataResponse {
     data: AppUser | undefined | null;
}
