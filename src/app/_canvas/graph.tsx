import { useAtomValue } from "jotai";
import { Group, Line } from "react-konva";
import { wavelengthToRGB } from "../../wavelength";
import {
	distance,
	distanceAtomWithValidation,
	slitSpacing,
	slitSpacingAtomWithValidation,
	slitWidth,
	slitWidthAtomWithValidation,
	wavelength,
	wavelengthAtomWithValidation,
} from "../variables";
import {
	centerY,
	screenScale,
	screenXAtom,
	virtualHeight,
} from "./coordinates";

const sinc = (θ: number) => {
	return θ === 0 ? 1 : Math.sin(θ) / θ;
};

const calculateTheta = (x: number, D: number) => {
	return Math.atan(x / D);
};

const calculateIntensityOfInterference = (θ: number, d: number, λ: number) => {
	return Math.cos((Math.PI * d * Math.sin(θ)) / λ) ** 2;
};

const calculateIntensityOfDiffraction = (θ: number, b: number, λ: number) => {
	return sinc((Math.PI * b * Math.sin(θ)) / λ) ** 2;
};

const getNumber = (value: number, exponent: number) => {
	return Number(`${value}e${exponent}`);
};

const resolution = 1e2;

const Graph = () => {
	const D = getNumber(
		useAtomValue(distanceAtomWithValidation),
		distance.exponent,
	);
	const d = getNumber(
		useAtomValue(slitSpacingAtomWithValidation),
		slitSpacing.exponent,
	);
	const b = getNumber(
		useAtomValue(slitWidthAtomWithValidation),
		slitWidth.exponent,
	);
	const λ = getNumber(
		useAtomValue(wavelengthAtomWithValidation),
		wavelength.exponent,
	);

	const yScaleForTheta =
		1 /
		(Math.pow(
			10,
			-(wavelength.exponent + distance.exponent - slitSpacing.exponent),
		) *
			resolution);
	const interferencePoints: number[][] = [];
	const diffractionPoints: number[][] = [];
	const points: number[][] = [];
	for (
		let i = 0, maxI = (virtualHeight / (2 * screenScale)) * resolution;
		i < maxI;
		i++
	) {
		const θ = calculateTheta(i * yScaleForTheta, D);
		const interference = calculateIntensityOfInterference(θ, d, λ);
		const diffraction = calculateIntensityOfDiffraction(θ, b, λ);
		const intensity = interference * diffraction;

		const yCoords = (i * screenScale) / resolution;
		interferencePoints.push([interference * 100, yCoords]);
		diffractionPoints.push([diffraction * 100, yCoords]);
		points.push([intensity * 100, yCoords]);
	}

	const x = useAtomValue(screenXAtom) + 10;
	const wavelengthValue = useAtomValue(wavelengthAtomWithValidation);
	const color = wavelengthToRGB(wavelengthValue);
	const lightColor = wavelengthToRGB(wavelengthValue, 0.5);

	return (
		<Group>
			{Object.entries({
				interferenceTop: interferencePoints,
				interferenceBottom: interferencePoints.map(([x, y]) => [x, -y]),
				diffractionTop: diffractionPoints,
				diffractionBottom: diffractionPoints.map(([x, y]) => [x, -y]),
				intensityTop: points,
				intensityBottom: points.map(([x, y]) => [x, -y]),
			}).map(([key, points]) => {
				return (
					<Line
						key={key}
						x={x}
						y={centerY}
						points={points.flat()}
						stroke={key === "intensity" ? color : lightColor}
						strokeWidth={2}
					/>
				);
			})}
		</Group>
	);
};

export default Graph;
