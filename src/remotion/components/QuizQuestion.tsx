import React from "react";

import {
  interpolate,
  useCurrentFrame,
} from "remotion";

import type {
  QuizQuestion as QuizQuestionType,
} from "../data/demoQuiz";

import { QuestionCard } from "./QuestionCard";
import { AnswerOption } from "./AnswerOption";
import { CountdownBar } from "./CountdownBar";

type Props = {
  question: QuizQuestionType;
  fps: number;
};

export const QuizQuestion: React.FC<Props> = ({
  question,
  fps,
}) => {
  const frame = useCurrentFrame();

  // 1 segundo antes do contador
  const introDuration = fps;

  // contador de 6 segundos
  const countdownDuration = fps * 6;

  // momento em que mostramos a resposta
  const revealFrame =
    introDuration + countdownDuration;

  const showCorrect =
    frame >= revealFrame;

  /*
   * Pequena animação de entrada.
   *
   * Não queremos exagerar porque
   * quiz precisa ser rápido.
   */
  const entrance = interpolate(
    frame,
    [0, 12],
    [0.96, 1],
    {
      extrapolateRight: "clamp",
    }
  );

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
      {/* ========================= */}
      {/* FUNDO DINÂMICO            */}
      {/* ========================= */}

      <div
        style={{
          position: "absolute",
          inset: 0,

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

      {/* Faixas diagonais */}

      <div
        style={{
          position: "absolute",

          inset: "-200px",

          opacity: 0.08,

          transform: "rotate(9deg)",

          background:
            "repeating-linear-gradient(90deg, #FFFFFF 0px, #FFFFFF 110px, transparent 110px, transparent 280px)",
        }}
      />

      {/* Bolinhas decorativas */}

      <div
        style={{
          position: "absolute",

          bottom: 100,
          left: 40,

          width: 220,
          height: 220,

          opacity: 0.08,

          backgroundImage:
            "radial-gradient(#FFFFFF 4px, transparent 4px)",

          backgroundSize: "28px 28px",
        }}
      />

      {/* ========================= */}
      {/* CONTEÚDO                  */}
      {/* ========================= */}

      <div
        style={{
          position: "relative",

          zIndex: 2,

          width: "100%",
          height: "100%",

          boxSizing: "border-box",

          padding:
            "150px 78px 110px",

          display: "flex",
          flexDirection: "column",

          alignItems: "center",

          transform: `scale(${entrance})`,
        }}
      >
        {/* Branding */}

        <div
          style={{
            display: "flex",

            alignItems: "center",
            justifyContent: "center",

            height: 90,

            marginBottom: 42,

            fontSize: 48,

            fontWeight: 900,

            letterSpacing: 2,

            color: "#FFFFFF",

            textShadow:
              "0 4px 0 rgba(0,0,0,0.25)",
          }}
        >
          QUIZVIDEO
        </div>

        {/* Card */}

        <QuestionCard
          question={question.question}
          image={question.image}
        />

        {/* Timer */}

        <div
          style={{
            width: "96%",

            marginTop: 50,
          }}
        >
          <CountdownBar
            startFrame={introDuration}
            durationInFrames={
              countdownDuration
            }
          />
        </div>

        {/* Respostas */}

        <div
          style={{
            width: "96%",

            marginTop: 56,

            display: "flex",
            flexDirection: "column",

            gap: 34,
          }}
        >
          {question.options.map(
            (option, index) => (
              <AnswerOption
                key={`${question.id}-${index}`}
                letter={String.fromCharCode(
                  65 + index
                )}
                text={option}
                isCorrect={
                  index ===
                  question.correctAnswer
                }
                showCorrect={showCorrect}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};