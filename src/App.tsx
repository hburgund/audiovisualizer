import { useControls } from "leva";
import Visualizer from "./components/visualizer/Visualizer";
import { VisualizerContextType } from "./context/VisualizerContext";
import { useMemo, useState } from "react";

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

  const contextValue = useMemo(() => {
    return { mode, setMode };
  }, [mode]);
  return <Visualizer {...contextValue} />;
}

export default App;
