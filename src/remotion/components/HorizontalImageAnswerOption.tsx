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

export const HorizontalImageAnswerOption: React.FC<Props> = ({
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
   * Altura completamente previsível.
   *
   * Isso garante que:
   * vertical
   * quadrada
   * horizontal
   *
   * tenham exatamente o mesmo card.
   */
  const cardHeight =
    showText
      ? 390
      : 340;

  const textHeight =
    showText
      ? 88
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

        overflow:
          "hidden",

        boxSizing:
          "border-box",

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
          30,

        boxShadow:
          "0 10px 0 rgba(0,0,0,0.18)",

        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      {/* LETRA A / B / C */}

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
            64,

          height:
            64,

          borderRadius:
            "50%",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          boxSizing:
            "border-box",

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

          fontSize:
            36,

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

      {/* CHECK DA RESPOSTA CERTA */}

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

      {/* IMAGEM */}

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

          flexShrink:
            0,

          overflow:
            "hidden",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          backgroundColor:
            "#E5E7EB",
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
              color:
                "#6B7280",

              fontSize:
                25,

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

      {/* TEXTO DO IMAGE_TEXT */}

      {showText && (
        <div
          style={{
            width:
              "100%",

            height:
              textHeight,

            flexShrink:
              0,

            boxSizing:
              "border-box",

            padding:
              "10px 12px",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            textAlign:
              "center",

            borderTop:
              "4px solid #111111",

            backgroundColor:
              highlight
                ? "#16A34A"
                : "#FFFFFF",

            color:
              highlight
                ? "#FFFFFF"
                : "#111111",

            fontSize:
              25,

            fontWeight:
              900,

            lineHeight:
              1.05,
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};