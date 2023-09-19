import type { PrimitiveAtom } from "jotai";
import { atom } from "jotai";

export interface Variable {
	name: string;
	symbol: string;
	unit: string;
	exponent: number;
	min: number;
	max: number;
	defaultValue: number;
}

const atomWithDefault = (variable: Variable) => {
	return atom(variable.defaultValue);
};
const atomWithValidation = (
	baseAtom: PrimitiveAtom<number>,
	variable: Variable,
) => {
	return atom((get) => {
		const value = get(baseAtom);
		if (value > variable.max) {
			return variable.max;
		}
		if (value < variable.min || !Number.isFinite(value)) {
			return variable.min;
		}
		return value;
	});
};

export const wavelength: Variable = {
	name: "Wavelength",
	symbol: "λ",
	unit: "nm",
	exponent: -9,
	min: 380,
	max: 780,
	defaultValue: 450,
};
export const wavelengthAtom = atomWithDefault(wavelength);
export const wavelengthAtomWithValidation = atomWithValidation(
	wavelengthAtom,
	wavelength,
);

export const slitWidth: Variable = {
	name: "Slit Width",
	symbol: "b",
	unit: "mm",
	exponent: -3,
	min: 1,
	max: 10,
	defaultValue: 3,
};
export const slitWidthAtom = atomWithDefault(slitWidth);
export const slitWidthAtomWithValidation = atomWithValidation(
	slitWidthAtom,
	slitWidth,
);

export const slitSpacing: Variable = {
	name: "Distance between Slit",
	symbol: "d",
	unit: "mm",
	exponent: -3,
	min: 0,
	max: 100,
	defaultValue: 30,
};
export const slitSpacingAtom = atomWithDefault(slitSpacing);
export const slitSpacingAtomWithValidation = atomWithValidation(
	slitSpacingAtom,
	slitSpacing,
);

export const distance: Variable = {
	name: "Distance between Slit and Screen",
	symbol: "D",
	unit: "m",
	exponent: 0,
	min: 1,
	max: 5,
	defaultValue: 2,
};
export const distanceAtom = atomWithDefault(distance);
export const distanceAtomWithValidation = atomWithValidation(
	distanceAtom,
	distance,
);
