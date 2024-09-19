/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    domains: ['gatherer.wizards.com', 'oaidalleapiprodscus.blob.core.windows.net', 'svgs.scryfall.io'],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
