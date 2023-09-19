import { Box } from "@chakra-ui/react";
import Konva from "konva";
import { RefObject, useEffect, useRef } from "react";
import { Layer, Stage, Text } from "react-konva";
import { useMeasure } from "react-use";
import { virtualHeight, virtualWidth } from "./coordinates";
import Graph from "./graph";
import WavesAndSlits from "./waves";

const Fps = ({ layerRef }: { layerRef: RefObject<Konva.Layer | null> }) => {
	const textReference = useRef<Konva.Text>(null);
	useEffect(() => {
		const animation = new Konva.Animation((frame) => {
			if (!frame) return false;
			textReference.current?.text(`${Math.round(frame.frameRate)} fps`);
		}, layerRef.current);
		animation.start();
		return () => {
			animation.stop();
		};
	});

	return <Text ref={textReference} fontSize={20} />;
};

const Canvas = () => {
	const [boxReference, { width: width }] = useMeasure<HTMLDivElement>();

	const layerReference = useRef<Konva.Layer>(null);

	return (
		<Box ref={boxReference} width="100%" padding={4}>
			<Stage
				width={width}
				height={(width * virtualHeight) / virtualWidth}
				scaleX={width / virtualWidth}
				scaleY={width / virtualWidth}
			>
				<Layer ref={layerReference} listening={false}>
					<WavesAndSlits layerRef={layerReference} />
					<Graph />
					{process.env.NODE_ENV === "development" && (
						<Fps layerRef={layerReference} />
					)}
				</Layer>
			</Stage>
		</Box>
	);
};

export default Canvas;
