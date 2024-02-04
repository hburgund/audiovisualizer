import React, { useEffect, useState } from "react";

interface FadeTextProps {
  text: string;
}

const FadeText: React.FC<FadeTextProps> = ({ text }) => {
  // State to manage the displayed text and opacity.
  const [displayedText, setDisplayedText] = useState(text);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Trigger fade out when text prop changes.
    if (text !== displayedText) {
      setOpacity(0); // Start fade out
    }
  }, [text, displayedText]);

  // Handle transition end event.
  const handleTransitionEnd = () => {
    if (opacity === 0) {
      // Once faded out, change the text and fade in.
      setDisplayedText(text);
      setOpacity(1); // Start fade in
    }
  };

  return (
    <div
      style={{
        transition: "opacity 1s",
        opacity: opacity,
        position: "absolute",
        top: "80%",
        left: "50%",
        transform: "translateX(-50%)",
        color: "white",
        fontSize: "2rem",
        textAlign: "center",
      }}
      onTransitionEnd={handleTransitionEnd}
    >
      {displayedText}
    </div>
  );
};

export default FadeText;
