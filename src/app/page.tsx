"use client";

import { Heading, VStack } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import dynamic from "next/dynamic";
import VariableInputs from "./input";
import {
	distance,
	distanceAtomWithValidation,
	slitSpacing,
	slitSpacingAtomWithValidation,
	wavelength,
	wavelengthAtomWithValidation,
} from "./variables";

const Canvas = dynamic(() => import("./_canvas/canvas"), { ssr: false });

const getNumber = (value: number, exponent: number) => {
	return Number(`${value}e${exponent}`);
};

const Page = () => {
	return (
		<VStack width="85%" padding={6} align="center" justify="center">
			<VariableInputs />
			<Heading size="md">
				Fringe Spacing (s) ={" "}
				{new Intl.NumberFormat("en-US", {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				}).format(
					((getNumber(
						useAtomValue(wavelengthAtomWithValidation),
						wavelength.exponent,
					) *
						getNumber(
							useAtomValue(distanceAtomWithValidation),
							distance.exponent,
						)) /
						getNumber(
							useAtomValue(slitSpacingAtomWithValidation),
							slitSpacing.exponent,
						)) *
						1e6,
				)}{" "}
				μm
			</Heading>
			<Canvas />
		</VStack>
	);
};

export default Page;
