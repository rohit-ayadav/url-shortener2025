import { NextConfig } from "next";

const nextConfig: NextConfig = {
  scriptLoader: {
    scripts: [{
      src: "https://checkout.razorpay.com/v1/checkout.js",
      strategy: "beforeInteractive"
    }]
  }
};

export default nextConfig;