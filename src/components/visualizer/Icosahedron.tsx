import { useEffect, useMemo, useRef } from "react";

import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import {
  Audio,
  AudioAnalyser,
  AudioContext,
  AudioListener,
  AudioLoader,
  IcosahedronGeometry,
  Mesh,
  ShaderMaterial,
} from "three";
import { fragmentShader, vertexShader } from "../../three/shaders";

import welcomeAudio from "../../assets/kelcey-welcome2.mp3";
import { useVisualizer } from "../../context/VisualizerContext";

function Icosahedron() {
  const mesh = useRef<Mesh<IcosahedronGeometry, ShaderMaterial>>(null);

  const [
    {
      red,
      green,
      blue,
      rotationSpeedX,
      rotationSpeedY,
      geometry,
      geometryRadius,
    },
    setParams,
  ] = useControls("Icosahedron", () => ({
    red: {
      value: 1.0,
      min: 0.0,
      max: 1.0,
    },
    green: { value: 1.0, min: 0.0, max: 1.0 },
    blue: {
      value: 1.0,
      min: 0.0,
      max: 1.0,
    },
    rotationSpeedX: {
      value: 0.005,
      min: 0.0,
      max: 0.05,
    },
    rotationSpeedY: {
      value: 0.005,
      min: 0.0,
      max: 0.05,
    },
    geometry: {
      value: "icosahedron",
      options: ["icosahedron", "torus"],
    },
    geometryRadius: {
      value: 2,
      min: 1,
      max: 5,
    },
  }));

  const three = useThree();

  const sound = useRef<Audio>();
  const audioAnalyser = useRef<AudioAnalyser>();

  const audioAnalyzer = useRef<AnalyserNode>();

  useEffect(() => {
    const listener = new AudioListener();
    three.camera.add(listener);
    sound.current = new Audio(listener);

    if (sound.current && !sound.current?.isPlaying) {
      const audioLoader = new AudioLoader();

      audioLoader.load(welcomeAudio, (buffer) => {
        if (sound.current) {
          sound.current.setBuffer(buffer);
          sound.current.setLoop(true);
        }
      });
    }

    audioAnalyser.current = new AudioAnalyser(sound.current, 32);
  }, []);

  const { mode } = useVisualizer();

  useEffect(() => {
    let userMediaStream: MediaStream | undefined;
    if (mode === "speaking" && sound.current && !sound.current?.isPlaying) {
      // window.addEventListener("click", () => {
      //   if (sound.current) {
      //     sound.current.play();
      //     soundStartTime.current = three.clock.elapsedTime;
      //   }
      // });
      sound.current.play();

      setParams({
        red: 1.0,
        green: 1.0,
        blue: 1.0,
      });
    } else {
      if (sound.current?.isPlaying) {
        sound.current.stop();
      }
    }

    if (mode === "listening") {
      // zero green blue
      setParams({
        red: 1.0,
        green: 0.0,
        blue: 0.0,
      });

      // from microphone
      const constraints = { audio: true, video: false };

      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        const context = AudioContext.getContext();
        const source = context.createMediaStreamSource(stream);
        audioAnalyzer.current = context.createAnalyser();
        source.connect(audioAnalyzer.current);

        userMediaStream = stream;
      });
    } else {
      // stop getting audio
      userMediaStream?.getTracks().forEach((track) => track.stop());
      setParams({
        geometryRadius: 2,
      });
    }
  }, [mode]);

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += rotationSpeedX;
      mesh.current.rotation.y += rotationSpeedY;

      mesh.current.material.uniforms.u_time.value =
        three.clock.getElapsedTime();

      mesh.current.material.uniforms.u_frequency.value =
        audioAnalyser.current?.getAverageFrequency();

      mesh.current.material.uniforms.u_audioPlaying.value = sound.current
        ?.isPlaying
        ? 1
        : 0;

      // red, green, blue
      mesh.current.material.uniforms.u_red.value = red;
      mesh.current.material.uniforms.u_green.value = green;
      mesh.current.material.uniforms.u_blue.value = blue;

      // get the amplitude
      if (mode === "listening" && audioAnalyzer.current) {
        const array = new Uint8Array(audioAnalyzer.current.frequencyBinCount);

        audioAnalyzer.current.getByteFrequencyData(array);

        const average = array.reduce((a, b) => a + b, 0) / array.length;

        function activation(x: number) {
          // should be between 2 and 2.5
          return (x / 255) * 3 + 2;
        }

        setParams({
          geometryRadius: activation(average),
        });
      }
    }
  });

  const uniforms = useMemo(() => {
    return {
      u_time: { value: 0.0 },
      u_frequency: { value: 0.0 },
      u_audioPlaying: { value: 0 }, // 0 for false, 1 for true
      u_red: { value: 1.0 },
      u_green: { value: 1.0 },
      u_blue: { value: 1.0 },
    };
  }, []);

  return (
    <mesh ref={mesh}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        wireframe
      />

      {geometry === "torus" ? (
        <torusGeometry args={[geometryRadius, 0.7, 20, 80]} />
      ) : (
        <icosahedronGeometry args={[geometryRadius, 20]} />
      )}
    </mesh>
  );
}

export default Icosahedron;
