import type { Metadata } from "next";
import { ReactNode } from "react";
import ClientLayout from "./client-layout";

export const metadata: Metadata = {
	title: "Double Slit Simulation",
};

const Layout = ({ children }: { children: ReactNode }) => {
	return (
		<html lang="en">
			<body>
				<ClientLayout>{children}</ClientLayout>
			</body>
		</html>
	);
};

export default Layout;
