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
  mode: VisualizerContextType["mode"];
  setMode: (mode: VisualizerContextType["mode"]) => void;

  displayText: string;
};
function Visualizer({ mode, setMode, displayText }: Props) {
  return (
    <AudioContextProvider>
      <VisualizerContext.Provider
        value={{
          mode,
          setMode,
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
          {/* display a text */}
          <div
            style={{
              position: "fixed",
              top: "80%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
              fontSize: "2rem",
            }}
          >
            {displayText}
          </div>
        </div>
      </VisualizerContext.Provider>
    </AudioContextProvider>
  );
}

export default Visualizer;
