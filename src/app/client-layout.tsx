"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { Center, ChakraProvider, Container } from "@chakra-ui/react";
import { ReactNode } from "react";
import Footer from "./footer";
import Header from "./header";

const ClientLayout = ({ children }: { children: ReactNode }) => {
	return (
		<CacheProvider>
			<ChakraProvider>
				<Container maxWidth="container.xl" minHeight="$100vh">
					<Header />
					<Center as="main">{children}</Center>
					<Footer />
				</Container>
			</ChakraProvider>
		</CacheProvider>
	);
};

export default ClientLayout;
