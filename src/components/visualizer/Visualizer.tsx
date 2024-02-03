import { Canvas } from "@react-three/fiber";
import { SRGBColorSpace } from "three";
import AudioContextProvider from "../../context/AudioContext";
import {
  VisualizerContext,
  VisualizerContextType,
} from "../../context/VisualizerContext";
import Camera from "./Camera";
import Effect from "./Effects";
import Icosahedron from "./Icosahedron";

type Props = {
  // mode is useState return value
  mode: VisualizerContextType["mode"];
  // setMode is useState setter
  setMode: (mode: VisualizerContextType["mode"]) => void;
};
function Visualizer(props: Props) {
  return (
    <AudioContextProvider>
      <VisualizerContext.Provider
        value={{
          ...props,
        }}
      >
        <div>
          <Canvas
            gl={{
              antialias: true,
              outputColorSpace: SRGBColorSpace,
            }}
            style={{
              height: "100vh",
              width: "100vw",
              background: "#000000",
            }}
          >
            <Camera />
            <Icosahedron />

            <Effect />
          </Canvas>
          <div
            id="audioText"
            style={{
              position: "absolute",
              top: "40%",
              left: "40%",
              color: "red",
              fontSize: "40px",
            }}
          ></div>
        </div>
      </VisualizerContext.Provider>
    </AudioContextProvider>
  );
}

export default Visualizer;
