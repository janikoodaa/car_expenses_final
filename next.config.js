/** @type {import('next').NextConfig} */
const nextConfig = {
     // output: "standalone",
     images: {
          remotePatterns: [
               {
                    protocol: "https",
                    hostname: "dsm01pap002files.storage.live.com",
                    port: "",
                    pathname: "**",
               },
          ],
          unoptimized: true,
     },
};

module.exports = nextConfig;
