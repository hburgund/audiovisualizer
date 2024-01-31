import { extend, useFrame, useThree } from "@react-three/fiber";

import { useEffect, useMemo, useRef } from "react";
import { UnrealBloomPass, RenderPass } from "three-stdlib";

import { Effects } from "@react-three/drei";
import { useControls } from "leva";
import { Audio, AudioAnalyser, AudioListener, Vector2 } from "three";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { useVisualizer } from "../../context/VisualizerContext";

extend({ UnrealBloomPass, OutputPass, RenderPass });

const EffectsComposer = () => {
  const { scene, camera } = useThree();

  const params = useControls("Bloom", {
    threshold: {
      value: 0.5,
      min: 0.0,
      max: 1.0,
    },
    strength: {
      value: 0.5,
      min: 0.0,
      max: 1.0,
    },
    radius: {
      value: 0.8,
      min: 0.0,
      max: 1.0,
    },
  });

  const aspect = useMemo(
    () => new Vector2(window.innerWidth, window.innerHeight),
    []
  );

  const { mode } = useVisualizer();

  const audioAnalyzer = useRef<AudioAnalyser>();

  useEffect(() => {
    if (mode === "listening") {
      const listener = new AudioListener();

      camera.add(listener);

      // create an audio source
      // const sound = new Audio(listener);

      // from microphone
      const constraints = { audio: true, video: false };

      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        if (!listener) return;

        const sound = new Audio(listener);

        sound.setMediaStreamSource(stream);

        // create an AudioAnalyser, passing in the sound and desired fftSize
        audioAnalyzer.current = new AudioAnalyser(sound, 32);
      });
    }
  }, [mode]);

  useFrame(() => {
    console.log(audioAnalyzer.current?.getAverageFrequency());
  });

  return (
    <Effects>
      <renderPass attach={"passes"} camera={camera} scene={scene} />
      {/* @ts-ignore */}
      <unrealBloomPass
        threshold={params.threshold}
        strength={params.strength}
        radius={params.radius}
        args={[aspect]}
        resolution={aspect}
      />
      {/* @ts-ignore */}
      <outputPass attach="passes" />
    </Effects>
  );
};

export default EffectsComposer;
