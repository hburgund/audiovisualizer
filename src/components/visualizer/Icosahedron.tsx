import { useEffect, useMemo, useRef } from "react";

import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import {
  Audio,
  AudioAnalyser,
  AudioContext,
  AudioListener,
  Color,
  IcosahedronGeometry,
  Mesh,
  PointLight,
  ShaderMaterial,
  Vector3,
} from "three";
import { fragmentShader, vertexShader } from "../../three/shaders";

import { useAudioContext } from "../../context/AudioContext";
import { useVisualizer } from "../../context/VisualizerContext";
import PointLightWithHelper from "./PointLightWithHelper";

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
    noiseFactor: {
      value: 3.0,
      min: 0.0,
      max: 10.0,
      onChange: (value) => {
        if (mesh.current) {
          mesh.current.material.uniforms.u_noiseFactor.value = value;
        }
      },
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

  const audioContext = useAudioContext();

  const audioElement = useMemo(
    () => document.getElementById("visualizer-audio") as HTMLMediaElement,
    []
  );

  const isPlaying = useRef(false);

  useEffect(() => {
    AudioContext.setContext(audioContext);

    const listener = new AudioListener();
    three.camera.add(listener);
    sound.current = new Audio(listener);

    sound.current.setMediaElementSource(audioElement);

    audioAnalyser.current = new AudioAnalyser(sound.current, 32);

    function onPlay() {
      isPlaying.current = true;
    }
    function onPause() {
      isPlaying.current = false;
    }

    audioElement.addEventListener("play", onPlay);
    audioElement.addEventListener("pause", onPause);

    return () => {
      audioElement.removeEventListener("play", onPlay);
      audioElement.removeEventListener("pause", onPause);
    };
  }, []);

  const { mode } = useVisualizer();

  useEffect(() => {
    let userMediaStream: MediaStream | undefined;
    if (mode === "speaking" && sound.current && !isPlaying.current) {
      audioElement.play();

      setParams({
        red: 1.0,
        green: 1.0,
        blue: 1.0,
      });
    } else {
      if (isPlaying.current) {
        audioElement.pause();
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

      mesh.current.material.uniforms.u_audioPlaying.value = isPlaying.current
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
      u_noiseFactor: { value: 3.0 },
    };
  }, []);

  return (
    <>
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
      <mesh>
        <circleGeometry args={[1.5, 32, 32]} />
        <shaderMaterial
          vertexShader={` varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }`}
          fragmentShader={`
                     varying vec2 vUv;
      void main() {
          float outerRadius = 1.5; // Circle's outer radius
          float innerRadius = 1.0; // Radius where transparency gradient starts
          // Transform vUv to range from 0 at the center to outerRadius at the edge
          vec2 transformedUv = (vUv - vec2(0.5, 0.5)) * outerRadius * 2.0;
          float distanceFromCenter = length(transformedUv);
          float alpha = 1.0;
          if (distanceFromCenter > innerRadius) {
              // Apply transparency gradient between innerRadius and outerRadius
              alpha = 1.0 - smoothstep(innerRadius, outerRadius, distanceFromCenter);
          }
          // Set color to black, with calculated alpha for transparency effect
          gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
      }
          `}
          transparent
        />
      </mesh>
      {/* <PointLightWithHelper position={[0, 0, 0]} /> */}
    </>
  );
}

export default Icosahedron;
