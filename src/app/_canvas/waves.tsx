import { useAtomValue } from "jotai/index";
import Konva from "konva";
import {
	createRef,
	JSX,
	RefObject,
	useCallback,
	useEffect,
	useRef,
} from "react";
import { Arc, Group, Line, Rect } from "react-konva";
import { wavelengthToRGB } from "../../wavelength";
import {
	slitWidthAtomWithValidation,
	slitWidth as slitWidthSettings,
	wavelengthAtomWithValidation,
} from "../variables";
import {
	centerY,
	lowerSlitYAtom,
	primarySlitX,
	screenXAtom,
	secondarySlitX,
	slitScale,
	sourceX,
	upperSlitYAtom,
	virtualHeight,
	virtualWidth,
	wavelengthScale,
} from "./coordinates";

const Slit = ({
	x,
	slitYArray,
	fixedWidth = false,
}: {
	x: number;
	slitYArray: number[];
	fixedWidth?: boolean;
}) => {
	let slitWidth = useAtomValue(slitWidthAtomWithValidation) * slitScale;
	if (fixedWidth) {
		slitWidth = slitWidthSettings.min * slitScale;
	}

	const yCoordinates: number[][] = [];
	for (let i = -1; i < slitYArray.length; i++) {
		const y1 = i === -1 ? 0 : slitYArray[i] + slitWidth / 2;
		const y2 =
			i === slitYArray.length - 1
				? virtualHeight
				: slitYArray[i + 1] - slitWidth / 2;
		if (y1 < y2) {
			yCoordinates.push([y1, y2]);
		}
	}

	return (
		<Group>
			{/* hide wave over the slit */}
			<Rect
				x={x}
				y={0}
				width={virtualWidth - x}
				height={virtualHeight}
				fill="white"
			/>
			{yCoordinates.map(([y1, y2]) => {
				return (
					<Line
						key={`${y1}-${y2}`}
						points={[x, y1, x, y2]}
						stroke="black"
						strokeWidth={3}
					/>
				);
			})}
		</Group>
	);
};

const Wave = ({
	layerRef,
	centerX,
	centerY,
	displayRect,
	wavePath = [],
}: {
	layerRef: RefObject<Konva.Layer | null>;
	centerX: number;
	centerY: number;
	displayRect: number[];
	wavePath?: number[];
}) => {
	const references = useRef<RefObject<Konva.Arc>[]>([]);
	const wavelength = useAtomValue(wavelengthAtomWithValidation);
	const wavelengthInCanvas = wavelength * wavelengthScale;

	const [left, up, right, down] = displayRect;
	const maxDistance = Math.max(
		Math.hypot(centerX - left, centerY - up),
		Math.hypot(centerX - left, centerY - down),
		Math.hypot(centerX - right, centerY - up),
		Math.hypot(centerX - right, centerY - down),
	);
	const wavefronts = Math.ceil(maxDistance / wavelengthInCanvas);

	let pathDistance = 0;
	if (wavePath.length > 0) {
		for (let j = 0; j < wavePath.length; j += 2) {
			const endX = j + 2 < wavePath.length ? wavePath[j + 2] : centerX;
			const endY = j + 3 < wavePath.length ? wavePath[j + 3] : centerY;
			pathDistance += Math.hypot(wavePath[j] - endX, wavePath[j + 1] - endY);
		}
	}

	const calculateRadius = useCallback(
		(i: number) => {
			return Math.max(
				0,
				-(pathDistance % wavelengthInCanvas) +
					i * wavelengthInCanvas +
					((performance.now() * 0.08) % wavelengthInCanvas),
			);
		},
		[pathDistance, wavelengthInCanvas],
	);

	useEffect(() => {
		const animation = new Konva.Animation(() => {
			references.current.forEach((reference, i) => {
				if (!reference.current) return false;

				const radius = calculateRadius(i);
				reference.current.innerRadius(radius);
				reference.current.outerRadius(radius);
			});
		}, layerRef.current);

		animation.start();
		return () => {
			animation.stop();
		};
	}, [references, calculateRadius, layerRef]);

	return (
		<Group>
			{Array.from<never, JSX.Element>({ length: wavefronts }, (_, i) => {
				const radius = calculateRadius(i);
				return (
					<Arc
						key={i}
						ref={(references.current[i] = createRef())}
						x={centerX}
						y={centerY}
						innerRadius={radius}
						outerRadius={radius}
						angle={180}
						rotationDeg={-90}
						stroke={wavelengthToRGB(wavelength, 0.8)}
						strokeWidth={2}
						// for performance
						hitStrokeWidth={0}
						perfectDrawEnabled={false}
						shadowForStrokeEnabled={false}
					/>
				);
			})}
		</Group>
	);
};

const WavesAndSlits = ({
	layerRef,
}: {
	layerRef: RefObject<Konva.Layer | null>;
}) => {
	const upperSlitY = useAtomValue(upperSlitYAtom);
	const lowerSlitY = useAtomValue(lowerSlitYAtom);

	const screenX = useAtomValue(screenXAtom);

	return (
		<Group>
			{/* wave from the source */}
			<Wave
				layerRef={layerRef}
				centerX={sourceX}
				centerY={centerY}
				displayRect={[sourceX, 0, primarySlitX, virtualHeight]}
			/>
			{/* primary slit */}
			<Slit x={primarySlitX} slitYArray={[centerY]} fixedWidth />

			{/* wave from the primary slit */}
			<Wave
				layerRef={layerRef}
				centerX={primarySlitX}
				centerY={centerY}
				displayRect={[primarySlitX, 0, secondarySlitX, virtualHeight]}
				wavePath={[sourceX, centerY]}
			/>
			{/* secondary slit */}
			<Slit
				x={secondarySlitX}
				slitYArray={[
					useAtomValue(upperSlitYAtom),
					useAtomValue(lowerSlitYAtom),
				]}
			/>

			{/* wave from the secondary slit */}
			{[...new Set([upperSlitY, lowerSlitY])].map((slitY) => {
				return (
					<Wave
						key={slitY}
						layerRef={layerRef}
						centerX={secondarySlitX}
						centerY={slitY}
						displayRect={[secondarySlitX, 0, screenX, virtualHeight]}
						wavePath={[sourceX, centerY, primarySlitX, centerY]}
					/>
				);
			})}
			{/* screen */}
			<Slit x={screenX} slitYArray={[]} fixedWidth />
		</Group>
	);
};

export default WavesAndSlits;
