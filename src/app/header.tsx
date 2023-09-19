"use client";

import { HStack, Heading } from "@chakra-ui/react";

const Header = () => {
	return (
		<HStack
			as="header"
			justify="center"
			minWidth="100%"
			padding={4}
			spacing={6}
			borderBottomWidth={1}
			borderStyle="solid"
			borderColor="gray.400"
		>
			<Heading size="lg">Double Slit Simulation</Heading>
		</HStack>
	);
};

export default Header;
