import { extend, useThree } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { useWindowSize } from "@uidotdev/usehooks";
// import { EffectComposer } from "@react-three/postprocessing";
import { useMemo } from "react";
import { Vector2 } from "three";
import {
  OutputPass,
  RenderPass,
  UnrealBloomPass,
} from "three/examples/jsm/Addons.js";

const params = {
  red: 1.0,
  green: 1.0,
  blue: 1.0,
  threshold: 0.5,
  strength: 0.5,
  radius: 0.8,
};
extend({ EffectComposer, RenderPass, UnrealBloomPass, OutputPass });

const Effect = () => {
  const three = useThree();

  const { width, height } = useWindowSize();

  return (
    <EffectComposer>
      <renderPass attach="passes" args={[three.scene, three.camera]} />
      <unrealBloomPass
        attachArray="passes"
        args={[
          width / height,
          params.strength,
          params.radius,
          params.threshold,
        ]}
      />
    </EffectComposer>
  );
};

export default Effect;
