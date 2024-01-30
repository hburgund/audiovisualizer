import { useRef } from "react";

import { ShaderMaterial } from "three";
import { fragmentShader, vertexShader } from "../../three/shaders";
import { useControls } from "leva";
function Icosahedron() {
  const material = useRef<ShaderMaterial>(null);

  const { red, green, blue } = useControls({
    red: { value: 1, min: 0.0, max: 1.0 },
    green: { value: 1.0, min: 0.0, max: 1.0 },
    blue: {
      value: 1.0,
      min: 0.0,
      max: 1.0,
    },
  });

  return (
    <mesh>
      <shaderMaterial
        ref={material}
        uniforms={{
          u_time: { value: 0.0 },
          u_frequency: { value: 0.0 },
          u_audioPlaying: { value: 0 }, // 0 for false, 1 for true
          u_red: { value: red },
          u_green: { value: green },
          u_blue: { value: blue },
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        wireframe
      />

      <icosahedronGeometry args={[2, 20]} />
    </mesh>
  );
}

export default Icosahedron;
