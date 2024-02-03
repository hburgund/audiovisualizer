import { extend, useFrame, useThree } from "@react-three/fiber";

import { useEffect, useMemo, useRef } from "react";
import { RenderPass, UnrealBloomPass } from "three-stdlib";

import { Effects } from "@react-three/drei";
import { useControls } from "leva";
import { AudioContext, AudioListener, Vector2 } from "three";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { useVisualizer } from "../../context/VisualizerContext";

extend({ UnrealBloomPass, OutputPass, RenderPass });

const EffectsComposer = () => {
  const { scene, camera } = useThree();

  const [params, setParams] = useControls("Bloom", () => ({
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
  }));

  const aspect = useMemo(
    () => new Vector2(window.innerWidth, window.innerHeight),
    []
  );

  const { mode } = useVisualizer();

  const audioAnalyzer = useRef<AnalyserNode>();

  useEffect(() => {
    let userMediaStream: MediaStream | undefined;
    if (mode === "listening") {
      const listener = new AudioListener();

      camera.add(listener);

      // create an audio source
      // const sound = new Audio(listener);

      // from microphone
      const constraints = { audio: true, video: false };

      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        const context = AudioContext.getContext();
        const source = context.createMediaStreamSource(stream);
        audioAnalyzer.current = context.createAnalyser();
        source.connect(audioAnalyzer.current);

        userMediaStream = stream;
      });

      setParams({
        threshold: 0.2,
        strength: 0.4,
      });
    } else {
      // stop getting audio
      userMediaStream?.getTracks().forEach((track) => track.stop());
      setParams({
        threshold: 0.5,
        radius: 0.8,
      });
    }
  }, [mode]);

  useFrame(() => {
    // get the amplitude
    if (mode === "listening" && audioAnalyzer.current) {
      const array = new Uint8Array(audioAnalyzer.current.frequencyBinCount);
      audioAnalyzer.current.getByteFrequencyData(array);

      const average = array.reduce((a, b) => a + b, 0) / array.length;

      function activation(x: number) {
        return x / 255;
      }

      setParams({
        radius: activation(average),
      });
    }
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
