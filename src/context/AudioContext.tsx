import { createContext, useContext, useMemo } from "react";

export const audioContextContext = createContext<AudioContext>(undefined!);

export const useAudioContext = () => useContext(audioContextContext);

export default function AudioContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const audioContext = useMemo(() => {
    // @ts-ignore
    return new (window.AudioContext || window.webkitAudioContext)();
  }, []);
  return (
    <audioContextContext.Provider value={audioContext}>
      {children}
    </audioContextContext.Provider>
  );
}
