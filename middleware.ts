export { default } from "next-auth/middleware";

export const config = { matcher: ["/protected/:path*", "/vehicles/:path*", "/history/:path*", "/user/:path*"] };
