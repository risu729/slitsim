export const wavelengthToRGB = (
	wavelength: number,
	alpha?: number | string,
) => {
	// taken from https://academo.org/demos/wavelength-to-colour-relationship/
	const gamma = 0.8;
	const maxIntensity = 255;
	let factor, red, green, blue;
	if (wavelength >= 380 && wavelength < 440) {
		red = -(wavelength - 440) / (440 - 380);
		green = 0;
		blue = 1;
	} else if (wavelength >= 440 && wavelength < 490) {
		red = 0;
		green = (wavelength - 440) / (490 - 440);
		blue = 1;
	} else if (wavelength >= 490 && wavelength < 510) {
		red = 0;
		green = 1;
		blue = -(wavelength - 510) / (510 - 490);
	} else if (wavelength >= 510 && wavelength < 580) {
		red = (wavelength - 510) / (580 - 510);
		green = 1;
		blue = 0;
	} else if (wavelength >= 580 && wavelength < 645) {
		red = 1;
		green = -(wavelength - 645) / (645 - 580);
		blue = 0;
	} else if (wavelength >= 645 && wavelength < 781) {
		red = 1;
		green = 0;
		blue = 0;
	} else {
		red = 0;
		green = 0;
		blue = 0;
	}
	// Let the intensity fall off near the vision limits
	if (wavelength >= 380 && wavelength < 420) {
		factor = 0.3 + (0.7 * (wavelength - 380)) / (420 - 380);
	} else if (wavelength >= 420 && wavelength < 701) {
		factor = 1;
	} else if (wavelength >= 701 && wavelength < 781) {
		factor = 0.3 + (0.7 * (780 - wavelength)) / (780 - 700);
	} else {
		factor = 0;
	}
	if (red !== 0) {
		red = Math.round(maxIntensity * Math.pow(red * factor, gamma));
	}
	if (green !== 0) {
		green = Math.round(maxIntensity * Math.pow(green * factor, gamma));
	}
	if (blue !== 0) {
		blue = Math.round(maxIntensity * Math.pow(blue * factor, gamma));
	}
	return `rgb(${red}, ${green}, ${blue}, ${alpha ?? 1})`;
};

export const gradientByWavelength = (
	left: number,
	right: number,
	alpha?: number | string,
) => {
	const stepNumber = 20;
	const step = Math.round((right - left) / stepNumber);

	const colors = [];
	for (let i = 0; i <= stepNumber; i += 1) {
		colors.push(
			`${wavelengthToRGB(left + i * step, alpha)} ${(100 / stepNumber) * i}%`,
		);
	}
	return `linear-gradient(to right, ${colors.join(", ")})`;
};
