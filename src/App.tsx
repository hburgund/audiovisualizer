import { useControls } from "leva";
import { useMemo, useState } from "react";
import Visualizer from "./components/visualizer/Visualizer";
import { VisualizerContextType } from "./context/VisualizerContext";

function App() {
  const [mode, setMode] = useState<VisualizerContextType["mode"]>("neutral");

  useControls("Mode", () => ({
    mode: {
      value: mode,
      options: ["neutral", "speaking", "listening", "thinking"],
      onChange: (value) => {
        setMode(value);
      },
    },
  }));

  const audioContext = useMemo(() => new AudioContext(), []);

  return (
    <Visualizer
      mode={mode}
      setMode={setMode}
      displayText="Welcome to the visualizer"
      audioContext={audioContext}
    />
  );
}

export default App;
