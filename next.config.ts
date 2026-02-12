import type { NextConfig } from "next";

/** Extract just the origin (protocol + host + port) from a URL, stripping any path. */
function baseUrl(url: string): string {
	try {
		const parsed = new URL(url);
		return parsed.origin;
	} catch {
		return url;
	}
}

const nextConfig: NextConfig = {
	output: "standalone",
	webpack: (config, { dev }) => {
		if (dev) {
			config.watchOptions = {
				poll: 1000,
				aggregateTimeout: 300,
				ignored: /node_modules/,
			};
		}
		return config;
	},
	async rewrites() {
		const authUrl = baseUrl(process.env.AUTH_SERVICE_URL || "http://auth-service:3000");
		const userUrl = baseUrl(process.env.USER_SERVICE_URL || "http://user-service:3001");
		const statsUrl = baseUrl(process.env.STATS_SERVICE_URL || "http://stats-service:3005");
		const notificationUrl = baseUrl(process.env.NOTIFICATION_SERVICE_URL || "http://notification-service:3002");

		return [
			{
				source: "/api/v1/auth/:path*",
				destination: `${authUrl}/api/v1/auth/:path*`,
			},
			{
				source: "/api/v1/users/:path*",
				destination: `${userUrl}/api/v1/users/:path*`,
			},
			{
				source: "/api/v1/stats/:path*",
				destination: `${statsUrl}/api/v1/stats/:path*`,
			},
			{
				source: "/api/v1/notifications/:path*",
				destination: `${notificationUrl}/api/v1/notifications/:path*`,
			},
		];
	},
};

export default nextConfig;
