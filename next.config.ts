import withPWA from 'next-pwa';

const nextPWA = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // 개발 환경에서 비활성화
});

const nextConfig = {
  reactStrictMode: true,
  webpack: (config: { cache: boolean }) => {
    config.cache = false; // Webpack 캐시 비활성화
    return config;
  },
  sassOptions: {
    prependData: `@use "@/styles/_variables.scss" as *; @use "@/styles/_mixins.scss" as *;`,
  },
  images: {
    domains: ['hasyhjbsevkfzieejdyp.supabase.co'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextPWA(nextConfig);
