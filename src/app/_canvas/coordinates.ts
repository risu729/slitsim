import { atom } from "jotai";
import {
	distanceAtomWithValidation,
	slitSpacingAtomWithValidation,
} from "../variables";

export const virtualWidth = 1000;
export const virtualHeight = 500;

export const wavelengthScale = 0.05;
export const slitScale = 3;
const distanceScale = 100;
export const screenScale = (wavelengthScale * distanceScale) / slitScale;

export const sourceX = 0;
export const centerY = virtualHeight / 2;

export const primarySlitX = virtualWidth * 0.1;
export const secondarySlitX = virtualWidth * 0.2;
export const upperSlitYAtom = atom((get) => {
	return (virtualHeight - get(slitSpacingAtomWithValidation) * slitScale) / 2;
});
export const lowerSlitYAtom = atom((get) => {
	return (virtualHeight + get(slitSpacingAtomWithValidation) * slitScale) / 2;
});
export const screenXAtom = atom((get) => {
	return secondarySlitX + get(distanceAtomWithValidation) * distanceScale;
});
