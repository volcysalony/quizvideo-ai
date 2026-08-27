import React from "react";

import {
  Img,
  staticFile,
} from "remotion";

import type {
  QuizImageFit,
} from "../types/quiz";

type Props = {
  question: string;

  image?: string;

  imageFit?: QuizImageFit;

  imagePositionX?: number;

  imagePositionY?: number;

  imageScale?: number;
};

export const QuestionCard: React.FC<Props> = ({
  question,
  image,
  imageFit = "CONTAIN",
  imagePositionX = 50,
  imagePositionY = 50,
  imageScale = 1,
}) => {
  const imageSrc =
    image
      ? staticFile(
          image.replace(
            /^\//,
            ""
          )
        )
      : null;

  return (
    <div
      style={{
        width:
          "100%",

        minHeight:
          620,

        backgroundColor:
          "#FFFFFF",

        border:
          "5px solid #111111",

        borderRadius:
          44,

        boxShadow:
          "0 16px 0 rgba(0,0,0,0.20)",

        padding:
          "48px 44px 42px",

        boxSizing:
          "border-box",

        display:
          "flex",

        flexDirection:
          "column",

        alignItems:
          "center",

        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      {/* PERGUNTA */}

      <div
        style={{
          width:
            "100%",

          fontSize:
            66,

          fontWeight:
            900,

          lineHeight:
            1.06,

          textAlign:
            "center",

          letterSpacing:
            "-1.5px",

          color:
            "#111111",

          textTransform:
            "uppercase",
        }}
      >
        {question}
      </div>

      {/* IMAGEM */}

      <div
        style={{
          width:
            "82%",

          height:
            330,

          marginTop:
            38,

          borderRadius:
            34,

          overflow:
            "hidden",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          position:
            "relative",

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
                "COVER"
                  ? "cover"
                  : "contain",

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
              width:
                "100%",

              height:
                "100%",

              borderRadius:
                30,

              background:
                "linear-gradient(135deg, #F8FAFC 0%, #E5E7EB 100%)",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              color:
                "#6B7280",

              fontSize:
                34,

              fontWeight:
                800,
            }}
          >
            IMAGEM
          </div>
        )}
      </div>
    </div>
  );
};