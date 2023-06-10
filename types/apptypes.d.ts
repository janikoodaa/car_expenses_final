interface UserFromGraph {
     givenName: string | null;
     surname: string | null;
     initials: string | null;
     theme: "light" | "dark";
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
