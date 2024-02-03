import { createContext, useContext } from "react";

export const AudioContextContext = createContext<AudioContext>(undefined!);

export const useAudioContext = () => useContext(AudioContextContext);
