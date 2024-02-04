import { Canvas } from "@react-three/fiber";
import { SRGBColorSpace } from "three";
import { AudioContextContext } from "../../context/AudioContext";
import {
  VisualizerContext,
  VisualizerContextType,
} from "../../context/VisualizerContext";
import Camera from "./Camera";
import Effect from "./Effects";
import Icosahedron from "./Icosahedron";
import { useEffect, useState } from "react";
import FadeText from "./FadeText";

type Props = {
  mode: VisualizerContextType["mode"];
  setMode: (mode: VisualizerContextType["mode"]) => void;

  displayText: string;

  audioContext: AudioContext;
};

function Visualizer({ mode, setMode, displayText, audioContext }: Props) {
  return (
    <AudioContextContext.Provider value={audioContext}>
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
          <FadeText text={displayText} />
        </div>
      </VisualizerContext.Provider>
    </AudioContextContext.Provider>
  );
}

export default Visualizer;
