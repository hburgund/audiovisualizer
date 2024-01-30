import { useRef } from "react";

import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { AudioLoader, IcosahedronGeometry, Mesh, ShaderMaterial } from "three";
import { fragmentShader, vertexShader } from "../../three/shaders";

import welcomeAudio from "../../assets/kelcey-welcome2.mp3";
const rotationSpeedX = 0.005; // Rotation speed around X axis
const rotationSpeedY = 0.005; // Rotation speed around Y axis

function Icosahedron() {
  const mesh = useRef<Mesh<IcosahedronGeometry, ShaderMaterial>>(null);

  const { red, green, blue } = useControls({
    red: { value: 1, min: 0.0, max: 1.0 },
    green: { value: 1.0, min: 0.0, max: 1.0 },
    blue: {
      value: 1.0,
      min: 0.0,
      max: 1.0,
    },
  });

  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.x += rotationSpeedX;
      mesh.current.rotation.y += rotationSpeedY;

      mesh.current.material.uniforms.u_time.value = clock.getElapsedTime();
    }
  });

  const three = useThree();
  useLoader(AudioLoader, welcomeAudio);

  return (
    <mesh ref={mesh}>
      <shaderMaterial
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
