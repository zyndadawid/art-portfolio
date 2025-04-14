import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other config options (e.g., output: 'export' if needed)
};

export default withNextIntl(nextConfig);
