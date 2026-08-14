import React from "react";

import {
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
  const frame = useCurrentFrame();

  const introDuration =
    fps * introSeconds;

  const countdownDuration =
    fps * countdownSeconds;

  const revealFrame =
    introDuration +
    countdownDuration;

  const showCorrect =
    frame >= revealFrame;

  const entrance =
    interpolate(
      frame,
      [0, 12],
      [0.96, 1],
      {
        extrapolateLeft:
          "clamp",

        extrapolateRight:
          "clamp",
      }
    );

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
        width: "100%",
        height: "100%",

        position: "relative",

        overflow: "hidden",

        backgroundColor:
          question.backgroundColor,

        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      {/* FUNDO DECORATIVO */}

      <div
        style={{
          position: "absolute",
          inset: 0,

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
          position: "absolute",

          inset: "-300px",

          opacity: 0.07,

          transform:
            "rotate(8deg)",

          background:
            "repeating-linear-gradient(90deg, #FFFFFF 0px, #FFFFFF 150px, transparent 150px, transparent 360px)",
        }}
      />

      <div
        style={{
          position: "absolute",

          right: 30,
          bottom: 20,

          width: 300,
          height: 300,

          opacity: 0.06,

          backgroundImage:
            "radial-gradient(#FFFFFF 4px, transparent 4px)",

          backgroundSize:
            "28px 28px",
        }}
      />

      {/* CONTEÚDO */}

      <div
        style={{
          position: "relative",

          zIndex: 2,

          width: "100%",
          height: "100%",

          boxSizing:
            "border-box",

          padding:
            "34px 90px 42px",

          display: "flex",

          flexDirection:
            "column",

          alignItems:
            "center",

          transform:
            `scale(${entrance})`,
        }}
      >
        {/* TÍTULO DO QUIZ */}

        <div
          style={{
            transform:
              "scale(0.72)",

            transformOrigin:
              "top center",

            marginBottom:
              -18,
          }}
        >
          <QuizTitle
            title={
              quizTitle
            }
          />
        </div>

        {/* PERGUNTA CENTRALIZADA */}

        <div
          style={{
            width: "100%",

            minHeight: 175,

            backgroundColor:
              "#FFFFFF",

            border:
              "5px solid #111111",

            borderRadius: 34,

            boxShadow:
              "0 12px 0 rgba(0,0,0,0.18)",

            boxSizing:
              "border-box",

            padding:
              "28px 48px",

            display: "flex",

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
              fontSize: 54,

              fontWeight: 900,

              lineHeight: 1.05,

              letterSpacing:
                "-1.5px",

              color: "#111111",

              textTransform:
                "uppercase",

              maxWidth: 1500,
            }}
          >
            {
              question.question
            }
          </div>
        </div>

        {/* IMAGEM + RESPOSTAS */}

        <div
          style={{
            width: "100%",

            flex: 1,

            marginTop: 30,

            display: "grid",

            gridTemplateColumns:
              "0.95fr 1.05fr",

            gap: 34,

            minHeight: 0,
          }}
        >
          {/* IMAGEM */}

          <div
            style={{
              width: "100%",

              height: "100%",

              minHeight: 400,

              backgroundColor:
                "#FFFFFF",

              border:
                "5px solid #111111",

              borderRadius: 34,

              boxShadow:
                "0 12px 0 rgba(0,0,0,0.18)",

              padding: 18,

              boxSizing:
                "border-box",

              display: "flex",

              alignItems:
                "center",

              justifyContent:
                "center",
            }}
          >
            <div
              style={{
                width: "100%",

                height: "100%",

                overflow:
                  "hidden",

                borderRadius: 24,

                background:
                  "linear-gradient(135deg, #F8FAFC 0%, #E5E7EB 100%)",

                display: "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",
              }}
            >
              {imageSrc ? (
                <img
                  src={
                    imageSrc
                  }
                  alt=""
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
                      34,

                    fontWeight:
                      900,

                    letterSpacing:
                      "1px",
                  }}
                >
                  IMAGEM
                </div>
              )}
            </div>
          </div>

          {/* RESPOSTAS */}

          <div
            style={{
              display: "flex",

              flexDirection:
                "column",

              justifyContent:
                "space-between",

              gap: 20,

              minHeight: 0,
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
                      flex: 1,

                      minHeight:
                        120,

                      maxHeight:
                        150,

                      display:
                        "flex",

                      alignItems:
                        "center",

                      padding:
                        "16px 28px",

                      boxSizing:
                        "border-box",

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
                    }}
                  >
                    {/* LETRA */}

                    <div
                      style={{
                        width: 92,

                        height: 92,

                        flexShrink: 0,

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

                        fontSize: 52,

                        fontWeight: 900,

                        lineHeight: 1,

                        color:
                          highlight
                            ? "#16A34A"
                            : "#FFFFFF",

                        WebkitTextStroke:
                          highlight
                            ? "0"
                            : "1.5px #111111",

                        boxShadow:
                          "0 5px 0 rgba(0,0,0,0.18)",
                      }}
                    >
                      {String.fromCharCode(
                        65 +
                          index
                      )}
                    </div>

                    {/* TEXTO */}

                    <div
                      style={{
                        marginLeft:
                          28,

                        flex: 1,

                        fontSize:
                          38,

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
                      {
                        option.text
                      }
                    </div>

                    {/* CHECK */}

                    {highlight && (
                      <div
                        style={{
                          marginLeft:
                            18,

                          fontSize:
                            42,

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

        {/* TEMPORIZADOR */}

        <div
          style={{
            width: "64%",

            marginTop: 30,

            marginBottom: 4,
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