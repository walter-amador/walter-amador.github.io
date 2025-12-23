/**
 * Next.js static export config (GitHub Pages friendly)
 * - For user/organization pages (<user>.github.io): basePath should be empty.
 * - For project pages: basePath becomes /<repo> when building in GitHub Actions.
 */
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
const repoName = process.env.GITHUB_REPOSITORY?.split('/')?.[1];
const isUserSite = repoName?.endsWith('.github.io');
const basePath = isGitHubActions && repoName && !isUserSite ? `/${repoName}` : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'export',
	trailingSlash: true,
	images: { unoptimized: true },
	reactStrictMode: true,
	basePath,
	assetPrefix: basePath,
};

module.exports = nextConfig;
