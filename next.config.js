/** @type {import('next').NextConfig} */
export default {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "larva06.com",
				pathname: "/wp-content/themes/Larva06-theme/assets/images/*",
			},
		],
	},
};
