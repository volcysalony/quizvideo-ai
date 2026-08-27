import React from "react";

import {
  Img,
  staticFile,
} from "remotion";

import type {
  QuizAnswerMode,
  QuizImageFit,
} from "../types/quiz";

type Props = {
  letter: string;

  text: string;

  image?: string;

  answerMode: QuizAnswerMode;

  imageFit?: QuizImageFit;

  imagePositionX?: number;

  imagePositionY?: number;

  imageScale?: number;

  isCorrect: boolean;

  showCorrect: boolean;
};

export const VerticalImageAnswerOption: React.FC<Props> = ({
  letter,
  text,
  image,
  answerMode,
  imageFit = "COVER",
  imagePositionX = 50,
  imagePositionY = 50,
  imageScale = 1,
  isCorrect,
  showCorrect,
}) => {
  const highlight =
    showCorrect &&
    isCorrect;

  const showText =
    answerMode ===
    "IMAGE_TEXT";

  const imageSrc =
    image
      ? staticFile(
          image.replace(
            /^\//,
            ""
          )
        )
      : null;

  /*
   * ALTURA FIXA.
   *
   * Isso é o que impede uma imagem
   * vertical, quadrada ou horizontal
   * de modificar o tamanho do card.
   */
  const cardHeight =
    showText
      ? 420
      : 350;

  const textHeight =
    showText
      ? 92
      : 0;

  return (
    <div
      style={{
        position:
          "relative",

        width:
          "100%",

        height:
          cardHeight,

        boxSizing:
          "border-box",

        overflow:
          "hidden",

        display:
          "flex",

        flexDirection:
          "column",

        backgroundColor:
          highlight
            ? "#16A34A"
            : "#FFFFFF",

        border:
          "5px solid #111111",

        borderRadius:
          28,

        boxShadow:
          "0 10px 0 rgba(0,0,0,0.18)",
      }}
    >
      {/* LETRA */}

      <div
        style={{
          position:
            "absolute",

          top:
            12,

          left:
            12,

          zIndex:
            10,

          width:
            62,

          height:
            62,

          borderRadius:
            "50%",

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

          color:
            highlight
              ? "#16A34A"
              : "#FFFFFF",

          border:
            "4px solid #111111",

          boxShadow:
            "0 4px 0 rgba(0,0,0,0.18)",

          fontFamily:
            "Arial, Helvetica, sans-serif",

          fontSize:
            34,

          fontWeight:
            900,

          lineHeight:
            1,
        }}
      >
        {letter}
      </div>

      {/* CHECK */}

      {highlight && (
        <div
          style={{
            position:
              "absolute",

            top:
              14,

            right:
              14,

            zIndex:
              10,

            width:
              48,

            height:
              48,

            borderRadius:
              "50%",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            backgroundColor:
              "#FFFFFF",

            color:
              "#16A34A",

            border:
              "4px solid #111111",

            fontSize:
              30,

            fontWeight:
              900,
          }}
        >
          ✓
        </div>
      )}

      {/* ÁREA FIXA DA IMAGEM */}

      <div
        style={{
          position:
            "relative",

          width:
            "100%",

          height:
            showText
              ? cardHeight -
                textHeight
              : cardHeight,

          minHeight:
            0,

          flexShrink:
            0,

          overflow:
            "hidden",

          background:
            "#E5E7EB",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",
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
                imageFit ===
                "CONTAIN"
                  ? "contain"
                  : "cover",

              objectPosition:
                `${imagePositionX}% ${imagePositionY}%`,

              transform:
                `scale(${imageScale})`,

              transformOrigin:
                `${imagePositionX}% ${imagePositionY}%`,
            }}
          />
        ) : (
          <div
            style={{
              fontFamily:
                "Arial, Helvetica, sans-serif",

              fontSize:
                22,

              fontWeight:
                900,

              color:
                "#6B7280",

              textAlign:
                "center",
            }}
          >
            SEM IMAGEM
          </div>
        )}
      </div>

      {/* TEXTO FIXO */}

      {showText && (
        <div
          style={{
            width:
              "100%",

            height:
              textHeight,

            boxSizing:
              "border-box",

            padding:
              "12px 10px",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            textAlign:
              "center",

            fontFamily:
              "Arial, Helvetica, sans-serif",

            fontSize:
              26,

            fontWeight:
              900,

            lineHeight:
              1.05,

            color:
              highlight
                ? "#FFFFFF"
                : "#111111",

            backgroundColor:
              highlight
                ? "#16A34A"
                : "#FFFFFF",

            borderTop:
              "4px solid #111111",
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};