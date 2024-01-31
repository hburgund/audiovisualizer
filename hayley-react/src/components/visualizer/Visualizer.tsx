import { Canvas } from "@react-three/fiber";
import { SRGBColorSpace } from "three";
import Camera from "./Camera";
import Icosahedron from "./Icosahedron";
import Effect from "./Effects";

function Visualizer() {
  return (
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
  );
}

export default Visualizer;
