import { useControls } from "leva";
import { useEffect, useMemo, useState } from "react";
import Visualizer from "./components/visualizer/Visualizer";
import { VisualizerContextType } from "./context/VisualizerContext";
import audio from "./assets/kelcey-welcome2.mp3";
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

  const audioContext = useMemo(() => {
    const audioContext = new (window.AudioContext ||
      // @ts-ignore
      window.webkitAudioContext)();
    return audioContext;
  }, []);

  useEffect(() => {
    function activateAudioContext() {
      audioContext.resume();
      document.removeEventListener("click", activateAudioContext);
    }
    document.addEventListener("click", activateAudioContext);
    return () => {
      document.removeEventListener("click", activateAudioContext);
    };
  }, []);

  return (
    <div>
      <Visualizer
        mode={mode}
        setMode={setMode}
        displayText="Welcome to the visualizer"
        audioContext={audioContext}
      />

      <audio
        id="visualizer-audio"
        src={audio}
        controls
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
        }}
      />
    </div>
  );
}

export default App;
