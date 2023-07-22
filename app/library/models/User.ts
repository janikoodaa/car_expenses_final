export interface IAppUser {
     aadObjectId: string;
     aadUsername: string;
     givenName: string | null;
     surname: string | null;
     displayName?: string | null;
     initials?: string | null;
     mail?: string | null;
     theme?: "light" | "dark";
}
