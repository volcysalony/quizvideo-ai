import React from "react";
import {
  interpolate,
  useCurrentFrame,
} from "remotion";

import { classicQuizTheme } from "../templates/classicQuiz";

type Props = {
  startFrame: number;
  durationInFrames: number;
};

export const CountdownBar: React.FC<Props> = ({
  startFrame,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [
      startFrame,
      startFrame + durationInFrames,
    ],
    [100, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <div
      style={{
        position: "relative",

        width: "100%",
        height: 64,

        borderRadius: 999,

        backgroundColor:
          classicQuizTheme.timerBackground,

        border: `5px solid ${classicQuizTheme.timerBorder}`,

        boxSizing: "border-box",

        overflow: "visible",

        boxShadow:
          "0 8px 0 rgba(0,0,0,0.18)",
      }}
    >
      {/* Progresso */}

      <div
        style={{
          position: "absolute",

          left: 0,
          top: 0,
          bottom: 0,

          width: `${progress}%`,

          background:
            "linear-gradient(90deg, #1FE6D3, #06B6D4)",

          borderRadius: 999,

          overflow: "hidden",
        }}
      >
        {/* brilho */}

        <div
          style={{
            position: "absolute",

            left: "15%",
            top: 0,

            width: "18%",
            height: "100%",

            backgroundColor:
              "rgba(255,255,255,0.20)",
          }}
        />
      </div>

      {/* Marcador central */}

      <div
        style={{
          position: "absolute",

          left: "50%",
          top: "50%",

          transform:
            "translate(-50%, -50%)",

          width: 84,
          height: 84,

          borderRadius: "50%",

          backgroundColor: "#FFFFFF",

          border: "5px solid #111111",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          fontSize: 44,

          boxShadow:
            "0 6px 0 rgba(0,0,0,0.22)",

          zIndex: 10,
        }}
      >
        ⏱
      </div>
    </div>
  );
};