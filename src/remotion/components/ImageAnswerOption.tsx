import React from "react";

import {
  Img,
  staticFile,
} from "remotion";

import type {
  QuizAnswerMode,
} from "../types/quiz";

type Props = {
  letter: string;

  text: string;

  image?: string;

  answerMode: QuizAnswerMode;

  isCorrect?: boolean;

  showCorrect?: boolean;

  orientation:
    | "VERTICAL"
    | "HORIZONTAL";
};

export const ImageAnswerOption: React.FC<Props> = ({
  letter,
  text,
  image,
  answerMode,
  isCorrect = false,
  showCorrect = false,
  orientation,
}) => {
  const highlight =
    showCorrect &&
    isCorrect;

  const imageSrc =
    image
      ? staticFile(
          image.replace(
            /^\//,
            ""
          )
        )
      : null;

  const showText =
    answerMode ===
    "IMAGE_TEXT";

  const isVertical =
    orientation ===
    "VERTICAL";

  return (
    <div
      style={{
        position:
          "relative",

        width:
          "100%",

        height:
          "100%",

        minHeight:
          isVertical
            ? showText
              ? 390
              : 345
            : 340,

        boxSizing:
          "border-box",

        padding:
          isVertical
            ? "16px"
            : "18px",

        display:
          "flex",

        flexDirection:
          "column",

        overflow:
          "hidden",

        backgroundColor:
          highlight
            ? "#16A34A"
            : "#FFFFFF",

        border:
          "5px solid #111111",

        borderRadius:
          isVertical
            ? 30
            : 32,

        boxShadow:
          isVertical
            ? "0 10px 0 rgba(0,0,0,0.18)"
            : "0 12px 0 rgba(0,0,0,0.18)",

        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      {/* LETRA */}

      <div
        style={{
          position:
            "absolute",

          top:
            14,

          left:
            14,

          zIndex:
            5,

          width:
            isVertical
              ? 64
              : 72,

          height:
            isVertical
              ? 64
              : 72,

          borderRadius:
            "50%",

          boxSizing:
            "border-box",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          backgroundColor:
            highlight
              ? "#FFFFFF"
              : "#EF233C",

          border:
            "4px solid #111111",

          boxShadow:
            "0 4px 0 rgba(0,0,0,0.18)",

          color:
            highlight
              ? "#16A34A"
              : "#FFFFFF",

          fontSize:
            isVertical
              ? 38
              : 42,

          fontWeight:
            900,

          lineHeight:
            1,

          WebkitTextStroke:
            highlight
              ? "0"
              : "1px #111111",
        }}
      >
        {letter}
      </div>

      {/* IMAGEM */}

      <div
        style={{
          width:
            "100%",

          flex:
            1,

          minHeight:
            0,

          overflow:
            "hidden",

          borderRadius:
            20,

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          background:
            highlight
              ? "rgba(255,255,255,0.96)"
              : "linear-gradient(135deg, #F8FAFC 0%, #E5E7EB 100%)",
        }}
      >
        {imageSrc ? (
          <Img
            src={
              imageSrc
            }
            style={{
              width:
                "100%",

              height:
                "100%",

              objectFit:
                "contain",
            }}
          />
        ) : (
          <div
            style={{
              color:
                "#6B7280",

              fontSize:
                isVertical
                  ? 23
                  : 28,

              fontWeight:
                900,

              textAlign:
                "center",
            }}
          >
            SEM IMAGEM
          </div>
        )}
      </div>

      {/* TEXTO */}

      {showText && (
        <div
          style={{
            minHeight:
              isVertical
                ? 86
                : 90,

            padding:
              isVertical
                ? "16px 8px 4px"
                : "18px 10px 4px",

            boxSizing:
              "border-box",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            textAlign:
              "center",

            color:
              highlight
                ? "#FFFFFF"
                : "#111111",

            fontSize:
              isVertical
                ? 28
                : 30,

            fontWeight:
              900,

            lineHeight:
              1.05,
          }}
        >
          {text}
        </div>
      )}

      {/* CHECK */}

      {highlight && (
        <div
          style={{
            position:
              "absolute",

            top:
              18,

            right:
              18,

            zIndex:
              5,

            width:
              52,

            height:
              52,

            borderRadius:
              "50%",

            backgroundColor:
              "#FFFFFF",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            color:
              "#16A34A",

            border:
              "4px solid #111111",

            fontSize:
              34,

            fontWeight:
              900,
          }}
        >
          ✓
        </div>
      )}
    </div>
  );
};