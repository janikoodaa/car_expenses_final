/** Defines the form of response from any server method or function. */
export default interface IDataResponse<T> {
     status: "ok" | "error";
     data: T | null;
     error?: any;
}
