import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { PointLight, PointLightHelper } from "three";

function PointLightWithHelper({
  position,
}: {
  position: [number, number, number];
}) {
  const lightRef = useRef<PointLight>(null);
  const helperRef = useRef<PointLightHelper>(null);

  useFrame(() => {
    if (helperRef.current) {
      helperRef.current.update();
    }
  });

  return (
    <>
      <pointLight
        ref={lightRef}
        args={[0xffffff, -2, 1000]}
        position={position}
      />
      {lightRef.current && (
        <pointLightHelper args={[lightRef.current, 1]} ref={helperRef} />
      )}
    </>
  );
}

export default PointLightWithHelper;
