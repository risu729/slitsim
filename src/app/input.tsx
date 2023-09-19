import {
	HStack,
	Heading,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputProps,
	NumberInputStepper,
	Slider,
	SliderFilledTrack,
	SliderProps,
	SliderThumb,
	SliderTrack,
	Tooltip,
	useBoolean,
} from "@chakra-ui/react";
import { Atom, PrimitiveAtom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { memo } from "react";
import { gradientByWavelength, wavelengthToRGB } from "../wavelength";
import {
	Variable,
	distance,
	distanceAtom,
	distanceAtomWithValidation,
	slitSpacing,
	slitSpacingAtom,
	slitSpacingAtomWithValidation,
	slitWidth,
	slitWidthAtom,
	slitWidthAtomWithValidation,
	wavelength,
	wavelengthAtom,
	wavelengthAtomWithValidation,
} from "./variables";

const DirectInput = ({
	min,
	max,
	defaultValue,
	atom,
	...props
}: Pick<Variable, "min" | "max" | "defaultValue"> & {
	atom: PrimitiveAtom<number>;
} & NumberInputProps) => {
	const [value, setValue] = useAtom(atom);

	return (
		<NumberInput
			value={value}
			onChange={(_, value) => {
				setValue(value);
			}}
			allowMouseWheel
			min={min}
			max={max}
			defaultValue={defaultValue}
			{...props}
		>
			<NumberInputField />
			<NumberInputStepper>
				<NumberIncrementStepper>+</NumberIncrementStepper>
				<NumberDecrementStepper>-</NumberDecrementStepper>
			</NumberInputStepper>
		</NumberInput>
	);
};

const WavelengthSliderTrack = memo(function WavelengthSliderTrack({
	min,
	max,
}: Pick<Variable, "min" | "max">) {
	return <SliderTrack background={gradientByWavelength(min, max, "50%")} />;
});

const SliderWithTooltip = ({
	unit,
	min,
	max,
	defaultValue,
	isWavelength = false,
	atom,
	atomWithValidation,
	...props
}: Pick<Variable, "unit" | "min" | "max" | "defaultValue"> & {
	isWavelength?: boolean;
	atom: PrimitiveAtom<number>;
	atomWithValidation: Atom<number>;
} & SliderProps) => {
	const [showTooltip, setShowTooltip] = useBoolean();

	const value = useAtomValue(atomWithValidation);
	const setValue = useSetAtom(atom);

	return (
		<Slider
			focusThumbOnChange={false}
			value={value}
			onChange={(value) => {
				setValue(value);
			}}
			onMouseEnter={setShowTooltip.on}
			onMouseLeave={setShowTooltip.off}
			min={min}
			max={max}
			defaultValue={defaultValue}
			{...props}
		>
			{isWavelength ? (
				<WavelengthSliderTrack min={min} max={max} />
			) : (
				<SliderTrack>
					<SliderFilledTrack />
				</SliderTrack>
			)}
			<Tooltip isOpen={showTooltip} placement="top" label={`${value} ${unit}`}>
				<SliderThumb
					backgroundColor={isWavelength ? wavelengthToRGB(value) : undefined}
				/>
			</Tooltip>
		</Slider>
	);
};

const VariableInput = ({
	name,
	symbol,
	unit,
	min,
	max,
	defaultValue,
}: Variable) => {
	let isWavelength = false;
	let atom: PrimitiveAtom<number>;
	let atomWithValidation: Atom<number>;

	switch (symbol) {
		case "λ": {
			isWavelength = true;
			atom = wavelengthAtom;
			atomWithValidation = wavelengthAtomWithValidation;
			break;
		}
		case "b": {
			atom = slitWidthAtom;
			atomWithValidation = slitWidthAtomWithValidation;
			break;
		}
		case "d": {
			atom = slitSpacingAtom;
			atomWithValidation = slitSpacingAtomWithValidation;
			break;
		}
		case "D": {
			atom = distanceAtom;
			atomWithValidation = distanceAtomWithValidation;
			break;
		}
		default: {
			throw new Error("Unknown variable symbol");
		}
	}

	return (
		<HStack spacing={8} width="100%">
			<Heading size="md" width="50%">
				{`${symbol} (${name}) / ${unit}`}
			</Heading>
			<DirectInput
				min={min}
				max={max}
				defaultValue={defaultValue}
				atom={atom}
				maxWidth="20%"
			/>
			<SliderWithTooltip
				unit={unit}
				min={min}
				max={max}
				defaultValue={defaultValue}
				isWavelength={isWavelength}
				atom={atom}
				atomWithValidation={atomWithValidation}
				maxWidth="30%"
				colorScheme="gray"
			/>
		</HStack>
	);
};

const VariableInputs = () => {
	return (
		<>
			<VariableInput {...wavelength} />
			<VariableInput {...slitWidth} />
			<VariableInput {...slitSpacing} />
			<VariableInput {...distance} />
		</>
	);
};

export default VariableInputs;
