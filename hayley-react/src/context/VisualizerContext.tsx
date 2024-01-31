import { useControls } from "leva";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

type VisualizerContextType = {
  mode: "neutral" | "listening" | "speaking" | "thinking";
  setMode: (mode: VisualizerContextType["mode"]) => void;
};
const VisualizerContext = createContext<VisualizerContextType>(undefined!);

export const useVisualizer = () => useContext(VisualizerContext);
export default function VisualizeProvider({ children }: PropsWithChildren<{}>) {
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
  return (
    <VisualizerContext.Provider value={contextValue}>
      {children}
    </VisualizerContext.Provider>
  );
}
