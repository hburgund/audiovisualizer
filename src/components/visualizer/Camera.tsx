import { PerspectiveCamera } from "@react-three/drei";

const Camera = () => {
  // const mouseX = useRef(0);
  // const mouseY = useRef(0);

  // useEffect(() => {
  //   document.addEventListener("mousemove", (e) => {
  //     let windowHalfX = window.innerWidth / 2;
  //     let windowHalfY = window.innerHeight / 2;
  //     mouseX.current = (e.clientX - windowHalfX) / 100;
  //     mouseY.current = (e.clientY - windowHalfY) / 100;
  //   });
  // }, []);

  // useFrame(({ camera, scene }) => {
  //   camera.position.x += (mouseX.current - camera.position.x) * 0.05;
  //   camera.position.y += (-mouseY.current - camera.position.y) * 0.5;
  //   camera.lookAt(scene.position);
  // });
  return (
    <PerspectiveCamera
      makeDefault
      position={[0, -2, 14]}
      fov={45}
      near={0.1}
      far={1000}
      aspect={window.innerWidth / window.innerHeight}
    />
  );
};

export default Camera;
