import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.woodpartners.com" },
      { protocol: "https", hostname: "holbrooklife.com" },
      { protocol: "https", hostname: "www.americancampus.com" },
      { protocol: "https", hostname: "cdn.prod.website-files.com" },
      { protocol: "https", hostname: "www.waldenatoakwood.com" },
      { protocol: "https", hostname: "www.atlantatownhomes.com" },
      { protocol: "https", hostname: "photos.prod.cirrussystem.net" },
      { protocol: "https", hostname: "firstwalk.com" },
      { protocol: "https", hostname: "i0.wp.com" },
      { protocol: "https", hostname: "lirp.cdn-website.com" },
      { protocol: "https", hostname: "homesofchamblee.com" },
      { protocol: "https", hostname: "scontent-atl3-2.xx.fbcdn.net" },
      { protocol: "https", hostname: "healthcaresnapshots.com" },
      { protocol: "https", hostname: "stablesmotorcondos.com" },
      { protocol: "https", hostname: "wolfmediausa.com" },
      { protocol: "https", hostname: "mdatl.com" },
    ],
  },
};

export default nextConfig;
