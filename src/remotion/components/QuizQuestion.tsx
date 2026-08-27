import React from "react";

import {
  interpolate,
  useCurrentFrame,
} from "remotion";

import type {
  QuizQuestion as QuizQuestionType,
} from "../types/quiz";

import {
  QuestionCard,
} from "./QuestionCard";

import {
  AnswerOption,
} from "./AnswerOption";

import {
  CountdownBar,
} from "./CountdownBar";

import {
  QuizTitle,
} from "./QuizTitle";

import {
  VerticalImageAnswerOption,
} from "./VerticalImageAnswerOption";

type Props = {
  quizTitle: string;

  question: QuizQuestionType;

  fps: number;

  introSeconds: number;

  countdownSeconds: number;
};

export const QuizQuestion: React.FC<Props> = ({
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
              circle at 10% 15%,
              rgba(255,255,255,0.14),
              transparent 28%
            ),
            radial-gradient(
              circle at 90% 75%,
              rgba(0,0,0,0.08),
              transparent 30%
            )
          `,
        }}
      />

      {/* FAIXAS */}

      <div
        style={{
          position:
            "absolute",

          inset:
            "-200px",

          opacity:
            0.08,

          transform:
            "rotate(9deg)",

          background:
            "repeating-linear-gradient(90deg, #FFFFFF 0px, #FFFFFF 110px, transparent 110px, transparent 280px)",
        }}
      />

      {/* PONTOS */}

      <div
        style={{
          position:
            "absolute",

          bottom:
            100,

          left:
            40,

          width:
            220,

          height:
            220,

          opacity:
            0.08,

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
            "150px 78px 110px",

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
        <QuizTitle
          title={
            quizTitle
          }
        />

        {/* PERGUNTA */}

        <QuestionCard
          question={
            question.question
          }
          image={
            question.image
          }
          imageFit={
            question.imageFit
          }
          imagePositionX={
            question.imagePositionX
          }
          imagePositionY={
            question.imagePositionY
          }
          imageScale={
            question.imageScale
          }
        />

        {/* TIMER */}

        <div
          style={{
            width:
              "96%",

            marginTop:
              50,
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

        {/* =========================================
            TEXTO
            ========================================= */}

        {!usesImages && (
          <div
            style={{
              width:
                "96%",

              marginTop:
                56,

              display:
                "flex",

              flexDirection:
                "column",

              gap:
                34,
            }}
          >
            {question.options.map(
              (
                option,
                index
              ) => (
                <AnswerOption
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
        )}

        {/* =========================================
            IMAGENS / IMAGEM + TEXTO
            ========================================= */}

        {usesImages && (
          <div
            style={{
              width:
                "96%",

              marginTop:
                42,

              display:
                "grid",

              gridTemplateColumns:
                "repeat(3, minmax(0, 1fr))",

              gap:
                18,

              alignItems:
                "stretch",
            }}
          >
            {question.options.map(
              (
                option,
                index
              ) => (
                <VerticalImageAnswerOption
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
        )}
      </div>
    </div>
  );
};