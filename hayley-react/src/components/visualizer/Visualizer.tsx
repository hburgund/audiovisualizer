import { Canvas } from "@react-three/fiber";
import { SRGBColorSpace } from "three";
import Camera from "./Camera";
import Icosahedron from "./Icosahedron";

function Visualizer() {
  return (
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

      {/* <Effect /> */}
    </Canvas>
  );
}

export default Visualizer;
