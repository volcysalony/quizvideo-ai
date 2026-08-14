import React from "react";
import {
  interpolate,
  useCurrentFrame,
} from "remotion";

type Props = {
  title: string;
};

export const QuizTitle: React.FC<Props> = ({
  title,
}) => {
  const frame = useCurrentFrame();

  const scale = interpolate(
    frame,
    [0, 12],
    [0.9, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const opacity = interpolate(
    frame,
    [0, 8],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        maxWidth: "90%",

        padding: "20px 42px",

        marginBottom: 42,

        background:
          "rgba(255, 255, 255, 0.96)",

        border: "5px solid #111111",

        borderRadius: 999,

        boxShadow:
          "0 10px 0 rgba(0,0,0,0.20)",

        transform: `scale(${scale})`,
        opacity,
      }}
    >
      <div
        style={{
          fontFamily:
            "Arial, Helvetica, sans-serif",

          fontSize: 45,
          fontWeight: 900,

          lineHeight: 1,

          textAlign: "center",

          letterSpacing: "0.5px",

          color: "#111111",

          textTransform: "uppercase",

          whiteSpace: "normal",
        }}
      >
        {title}
      </div>
    </div>
  );
};