/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  serverExternalPackages: [
    '@aws-sdk/client-bedrock-agentcore',
    '@aws-sdk/client-dynamodb',
    '@aws-sdk/lib-dynamodb',
  ],
  // Fix: OneDrive path has symlinks that break Next.js workspace root detection
  outputFileTracingRoot: path.join(__dirname, '../../'),
};

module.exports = nextConfig;
