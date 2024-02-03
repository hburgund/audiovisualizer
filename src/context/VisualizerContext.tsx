import { createContext, useContext } from "react";

export type VisualizerContextType = {
  mode: "neutral" | "listening" | "speaking" | "thinking";
  setMode: (mode: VisualizerContextType["mode"]) => void;
};
export const VisualizerContext = createContext<VisualizerContextType>(
  undefined!
);

export const useVisualizer = () => useContext(VisualizerContext);
