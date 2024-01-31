import { extend, useThree } from "@react-three/fiber";

import { useMemo } from "react";
import { UnrealBloomPass, RenderPass } from "three-stdlib";

import { Effects } from "@react-three/drei";
import { useControls } from "leva";
import { Vector2 } from "three";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

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
