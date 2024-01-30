import { useEffect, useRef } from "react";

import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import {
  Audio,
  AudioAnalyser,
  AudioListener,
  AudioLoader,
  IcosahedronGeometry,
  Mesh,
  ShaderMaterial,
} from "three";
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

  const three = useThree();

  const sound = useRef<Audio>();
  const audioAnalyser = useRef<AudioAnalyser>();

  const soundStartTime = useRef<number>(0);

  useEffect(() => {
    const listener = new AudioListener();
    three.set(({ camera }) => {
      camera.add(listener);
    });
    sound.current = new Audio(listener);
    const audioLoader = new AudioLoader();

    audioLoader.load(welcomeAudio, (buffer) => {
      if (sound.current) {
        sound.current.setBuffer(buffer);

        window.addEventListener("click", () => {
          if (sound.current) {
            sound.current.play();
            soundStartTime.current = three.clock.elapsedTime;
          }
        });
      }
    });

    audioAnalyser.current = new AudioAnalyser(sound.current, 32);
  }, []);

  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.x += rotationSpeedX;
      mesh.current.rotation.y += rotationSpeedY;

      const uniforms = mesh.current.material.uniforms;
      uniforms.u_time.value = clock.getElapsedTime();
      uniforms.u_frequency.value = audioAnalyser.current?.getAverageFrequency();
      uniforms.u_audioPlaying.value = sound.current?.isPlaying ? 1 : 0;

      const displayTextElement = document.getElementById("audioText");
      if (sound.current?.isPlaying && displayTextElement) {
        // update text
        const audioTime =
          sound.current.context.currentTime - soundStartTime.current;

        // Example: Display text based on audio time
        if (audioTime > 5 && audioTime < 10) {
          // Between 5 to 10 seconds
          displayTextElement.innerHTML = "First text segment";
        } else if (audioTime > 10 && audioTime < 15) {
          // Between 10 to 15 seconds
          displayTextElement.innerHTML = "Second text segment";
        } else if (audioTime > 20 && audioTime < 25) {
          // Between 10 to 15 seconds
          displayTextElement.innerHTML = "Ready to VOCALIZE?!?!?";
        } else {
          displayTextElement.innerHTML = "";
        }
      }
    }
  });

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
