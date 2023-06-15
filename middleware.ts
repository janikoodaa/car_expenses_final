export { default } from "next-auth/middleware";

export const config = { matcher: ["/protected/:path*", "/cars/:path*", "/history/:path*", "/user/:path*"] };
