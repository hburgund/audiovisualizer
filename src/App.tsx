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
      if (audioContext.state === "running") return;
      audioContext.resume();
    }
    document.addEventListener("click", activateAudioContext);
    return () => {
      document.removeEventListener("click", activateAudioContext);
    };
  }, []);

  const [displayText, setDisplayText] = useState("Welcome to the visualizer");

  useEffect(() => {
    const texts = [
      "Welcome to the visualizer",
      "A visualizer is a tool that generates visualizations of an audio signal",
      "The audio signal can be music, speech, or any other sound",
      "The visualizations are generated in real-time",
      "The visualizations are generated using the Web Audio API",
      "The Web Audio API is a high-level JavaScript API for processing and synthesizing audio in web applications",
      "The Web Audio API is not supported in Internet Explorer",
    ];

    let i = 0;

    const interval = setInterval(() => {
      setDisplayText(texts[i]);
      i = (i + 1) % texts.length;
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <Visualizer
        mode={mode}
        setMode={setMode}
        displayText={displayText}
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
