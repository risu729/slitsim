"use client";

import { Center, Text } from "@chakra-ui/react";

const Footer = () => {
	return (
		<Center as="footer" padding={4} position="sticky" top="$100vh">
			<Text fontSize="sm" color="gray.800">
				© 2023 Taku
			</Text>
		</Center>
	);
};

export default Footer;
