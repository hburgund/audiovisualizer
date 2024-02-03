import { useControls } from "leva";
import { useState } from "react";
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

  return (
    <Visualizer
      mode={mode}
      setMode={setMode}
      displayText="Welcome to the visualizer"
    />
  );
}

export default App;
