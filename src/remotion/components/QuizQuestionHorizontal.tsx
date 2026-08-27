import React from "react";

import {
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

import type {
  QuizQuestion as QuizQuestionType,
} from "../types/quiz";

import {
  CountdownBar,
} from "./CountdownBar";

import {
  QuizTitle,
} from "./QuizTitle";

import {
  HorizontalImageAnswerOption,
} from "./HorizontalImageAnswerOption";

type Props = {
  quizTitle: string;

  question: QuizQuestionType;

  fps: number;

  introSeconds: number;

  countdownSeconds: number;
};

export const QuizQuestionHorizontal: React.FC<Props> = ({
  quizTitle,
  question,
  fps,
  introSeconds,
  countdownSeconds,
}) => {
  const frame =
    useCurrentFrame();

  const introDuration =
    fps *
    introSeconds;

  const countdownDuration =
    fps *
    countdownSeconds;

  const revealFrame =
    introDuration +
    countdownDuration;

  const showCorrect =
    frame >=
    revealFrame;

  const entrance =
    interpolate(
      frame,
      [
        0,
        12,
      ],
      [
        0.96,
        1,
      ],
      {
        extrapolateLeft:
          "clamp",

        extrapolateRight:
          "clamp",
      }
    );

  const answerMode =
    question.answerMode ??
    "TEXT";

  const usesImages =
    answerMode ===
      "IMAGE" ||
    answerMode ===
      "IMAGE_TEXT";

  const imageSrc =
    question.image
      ? staticFile(
          question.image.replace(
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

        height:
          "100%",

        position:
          "relative",

        overflow:
          "hidden",

        backgroundColor:
          question.backgroundColor,

        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      {/* FUNDO */}

      <div
        style={{
          position:
            "absolute",

          inset:
            0,

          background: `
            radial-gradient(
              circle at 8% 15%,
              rgba(255,255,255,0.15),
              transparent 28%
            ),
            radial-gradient(
              circle at 92% 80%,
              rgba(0,0,0,0.10),
              transparent 30%
            )
          `,
        }}
      />

      <div
        style={{
          position:
            "absolute",

          inset:
            "-300px",

          opacity:
            0.07,

          transform:
            "rotate(8deg)",

          background:
            "repeating-linear-gradient(90deg, #FFFFFF 0px, #FFFFFF 150px, transparent 150px, transparent 360px)",
        }}
      />

      <div
        style={{
          position:
            "absolute",

          right:
            30,

          bottom:
            20,

          width:
            300,

          height:
            300,

          opacity:
            0.06,

          backgroundImage:
            "radial-gradient(#FFFFFF 4px, transparent 4px)",

          backgroundSize:
            "28px 28px",
        }}
      />

      {/* CONTEÚDO */}

      <div
        style={{
          position:
            "relative",

          zIndex:
            2,

          width:
            "100%",

          height:
            "100%",

          boxSizing:
            "border-box",

          padding:
            "26px 78px 34px",

          display:
            "flex",

          flexDirection:
            "column",

          alignItems:
            "center",

          transform:
            `scale(${entrance})`,
        }}
      >
        {/* TÍTULO */}

        <div
          style={{
            transform:
              "scale(0.68)",

            transformOrigin:
              "top center",

            marginBottom:
              -30,
          }}
        >
          <QuizTitle
            title={
              quizTitle
            }
          />
        </div>

        {/* PERGUNTA */}

        <div
          style={{
            width:
              "100%",

            minHeight:
              155,

            backgroundColor:
              "#FFFFFF",

            border:
              "5px solid #111111",

            borderRadius:
              32,

            boxShadow:
              "0 11px 0 rgba(0,0,0,0.18)",

            boxSizing:
              "border-box",

            padding:
              "24px 44px",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            textAlign:
              "center",
          }}
        >
          <div
            style={{
              fontSize:
                51,

              fontWeight:
                900,

              lineHeight:
                1.05,

              letterSpacing:
                "-1.5px",

              color:
                "#111111",

              textTransform:
                "uppercase",

              maxWidth:
                1550,
            }}
          >
            {question.question}
          </div>
        </div>

        {/* =================================================
            MODO TEXTO
            ================================================= */}

        {!usesImages && (
          <div
            style={{
              width:
                "100%",

              flex:
                1,

              marginTop:
                26,

              display:
                "grid",

              gridTemplateColumns:
                "0.95fr 1.05fr",

              gap:
                34,

              minHeight:
                0,
            }}
          >
            {/* IMAGEM DA PERGUNTA */}

            <div
              style={{
                width:
                  "100%",

                height:
                  "100%",

                minHeight:
                  390,

                overflow:
                  "hidden",

                backgroundColor:
                  "#FFFFFF",

                border:
                  "5px solid #111111",

                borderRadius:
                  32,

                boxShadow:
                  "0 11px 0 rgba(0,0,0,0.18)",

                padding:
                  16,

                boxSizing:
                  "border-box",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",
              }}
            >
              <div
                style={{
                  position:
                    "relative",

                  width:
                    "100%",

                  height:
                    "100%",

                  overflow:
                    "hidden",

                  borderRadius:
                    22,

                  background:
                    "linear-gradient(135deg, #F8FAFC 0%, #E5E7EB 100%)",

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
                        question.imageFit ===
                        "COVER"
                          ? "cover"
                          : "contain",

                      objectPosition:
                        `${question.imagePositionX ?? 50}% ${question.imagePositionY ?? 50}%`,

                      transform:
                        `scale(${question.imageScale ?? 1})`,

                      transformOrigin:
                        `${question.imagePositionX ?? 50}% ${question.imagePositionY ?? 50}%`,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      color:
                        "#6B7280",

                      fontSize:
                        34,

                      fontWeight:
                        900,
                    }}
                  >
                    IMAGEM
                  </div>
                )}
              </div>
            </div>

            {/* ALTERNATIVAS TEXTO */}

            <div
              style={{
                display:
                  "flex",

                flexDirection:
                  "column",

                justifyContent:
                  "space-between",

                gap:
                  18,

                minHeight:
                  0,
              }}
            >
              {question.options.map(
                (
                  option,
                  index
                ) => {
                  const isCorrect =
                    index ===
                    question.correctAnswer;

                  const highlight =
                    showCorrect &&
                    isCorrect;

                  return (
                    <div
                      key={`${question.id}-${index}`}
                      style={{
                        flex:
                          1,

                        minHeight:
                          115,

                        maxHeight:
                          145,

                        display:
                          "flex",

                        alignItems:
                          "center",

                        padding:
                          "14px 26px",

                        boxSizing:
                          "border-box",

                        backgroundColor:
                          highlight
                            ? "#16A34A"
                            : "#FFFFFF",

                        border:
                          "5px solid #111111",

                        borderRadius:
                          28,

                        boxShadow:
                          "0 9px 0 rgba(0,0,0,0.18)",
                      }}
                    >
                      <div
                        style={{
                          width:
                            86,

                          height:
                            86,

                          flexShrink:
                            0,

                          borderRadius:
                            "50%",

                          backgroundColor:
                            highlight
                              ? "#FFFFFF"
                              : "#EF233C",

                          border:
                            "5px solid #111111",

                          display:
                            "flex",

                          alignItems:
                            "center",

                          justifyContent:
                            "center",

                          fontSize:
                            48,

                          fontWeight:
                            900,

                          lineHeight:
                            1,

                          color:
                            highlight
                              ? "#16A34A"
                              : "#FFFFFF",

                          boxShadow:
                            "0 5px 0 rgba(0,0,0,0.18)",
                        }}
                      >
                        {String.fromCharCode(
                          65 +
                            index
                        )}
                      </div>

                      <div
                        style={{
                          marginLeft:
                            26,

                          flex:
                            1,

                          fontSize:
                            37,

                          fontWeight:
                            900,

                          lineHeight:
                            1.05,

                          color:
                            highlight
                              ? "#FFFFFF"
                              : "#111111",

                          textAlign:
                            "left",
                        }}
                      >
                        {option.text}
                      </div>

                      {highlight && (
                        <div
                          style={{
                            marginLeft:
                              18,

                            fontSize:
                              40,

                            fontWeight:
                              900,

                            color:
                              "#FFFFFF",
                          }}
                        >
                          ✓
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* =================================================
            IMAGE / IMAGE_TEXT
            ================================================= */}

        {usesImages && (
          <>
            {/* IMAGEM PRINCIPAL DA PERGUNTA */}

            {imageSrc && (
              <div
                style={{
                  width:
                    "58%",

                  height:
                    175,

                  marginTop:
                    18,

                  flexShrink:
                    0,

                  overflow:
                    "hidden",

                  backgroundColor:
                    "#FFFFFF",

                  border:
                    "5px solid #111111",

                  borderRadius:
                    28,

                  boxShadow:
                    "0 9px 0 rgba(0,0,0,0.18)",

                  padding:
                    10,

                  boxSizing:
                    "border-box",
                }}
              >
                <div
                  style={{
                    position:
                      "relative",

                    width:
                      "100%",

                    height:
                      "100%",

                    overflow:
                      "hidden",

                    borderRadius:
                      18,

                    backgroundColor:
                      "#E5E7EB",
                  }}
                >
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
                        question.imageFit ===
                        "COVER"
                          ? "cover"
                          : "contain",

                      objectPosition:
                        `${question.imagePositionX ?? 50}% ${question.imagePositionY ?? 50}%`,

                      transform:
                        `scale(${question.imageScale ?? 1})`,

                      transformOrigin:
                        `${question.imagePositionX ?? 50}% ${question.imagePositionY ?? 50}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* TRÊS ALTERNATIVAS */}

            <div
              style={{
                width:
                  "100%",

                marginTop:
                  imageSrc
                    ? 20
                    : 30,

                display:
                  "grid",

                gridTemplateColumns:
                  "repeat(3, minmax(0, 1fr))",

                gap:
                  22,

                alignItems:
                  "start",
              }}
            >
              {question.options.map(
                (
                  option,
                  index
                ) => (
                  <HorizontalImageAnswerOption
                    key={`${question.id}-${index}`}
                    letter={
                      String.fromCharCode(
                        65 +
                          index
                      )
                    }
                    text={
                      option.text
                    }
                    image={
                      option.image
                    }
                    answerMode={
                      answerMode
                    }
                    imageFit={
                      option.imageFit
                    }
                    imagePositionX={
                      option.imagePositionX
                    }
                    imagePositionY={
                      option.imagePositionY
                    }
                    imageScale={
                      option.imageScale
                    }
                    isCorrect={
                      index ===
                      question.correctAnswer
                    }
                    showCorrect={
                      showCorrect
                    }
                  />
                )
              )}
            </div>
          </>
        )}

        {/* TIMER */}

        <div
          style={{
            width:
              "62%",

            marginTop:
              usesImages
                ? 20
                : 26,

            marginBottom:
              2,
          }}
        >
          <CountdownBar
            startFrame={
              introDuration
            }
            durationInFrames={
              countdownDuration
            }
          />
        </div>
      </div>
    </div>
  );
};