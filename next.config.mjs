// /** @type {import('next').NextConfig} */
// const nextConfig = {
//      output:"standalone"
// };

// export default nextConfig; 

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//      output:"standalone"
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
     output: "standalone",
     serverRuntimeConfig: {
       // Private key for SSL/TLS
   
       sslKey: "/etc/letsencrypt/live/lms-api.annularprojects.com/privkey.pem",
       // SSL/TLS certificate
       sslCert: "/etc/letsencrypt/live/lms-api.annularprojects.com/fullchain.pem",
     },
     async rewrites() {
       return [
         {
           source: "/",
           destination: "lms-api.annularprojects.com:3000",
         },
       ];
     },
   };
   
   export default nextConfig;
