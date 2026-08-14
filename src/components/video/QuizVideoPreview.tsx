"use client";

import {
  useMemo,
} from "react";

import {
  Player,
} from "@remotion/player";

import {
  QuizVertical,
} from "@/remotion/compositions/QuizVertical";

import {
  QuizHorizontal,
} from "@/remotion/compositions/QuizHorizontal";

import type {
  QuizVideoProps,
} from "@/remotion/types/quiz";

type Props = {
  quiz: QuizVideoProps;

  width: number;

  height: number;
};

export function QuizVideoPreview({
  quiz,
  width,
  height,
}: Props) {
  const inputProps =
    useMemo(
      () => quiz,
      [quiz]
    );

  const secondsPerQuestion =
    quiz.introSeconds +
    quiz.countdownSeconds +
    quiz.revealSeconds;

  const durationInFrames =
    Math.max(
      1,

      Math.ceil(
        quiz.questions.length *
          secondsPerQuestion *
          quiz.fps
      )
    );

  const isVertical =
    height > width;

  const VideoComponent =
    isVertical
      ? QuizVertical
      : QuizHorizontal;

  return (
    <section
      className="
        rounded-3xl
        border
        border-white/10
        bg-[#101722]
        p-5
      "
    >
      {/* CABEÇALHO */}

      <div
        className="
          mb-4
          flex
          items-center
          justify-between
          gap-4
        "
      >
        <div>
          <h2 className="font-black text-white">
            Preview do vídeo
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Visualização real do Remotion.
          </p>
        </div>

        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <span
            className="
              rounded-full
              border
              border-white/10
              bg-white/5
              px-3
              py-1
              text-xs
              font-bold
              text-zinc-400
            "
          >
            {isVertical
              ? "9:16"
              : "16:9"}
          </span>

          <span
            className="
              rounded-full
              border
              border-white/10
              bg-white/5
              px-3
              py-1
              text-xs
              font-bold
              text-zinc-400
            "
          >
            {width}×{height}
          </span>
        </div>
      </div>

      {/* PLAYER */}

      <div
        className="
          flex
          min-h-[650px]
          items-center
          justify-center
          overflow-hidden
          rounded-2xl
          border
          border-white/10
          bg-[#05070b]
          p-5
        "
      >
        {quiz.questions.length >
        0 ? (
          <div
            style={{
              width:
                isVertical
                  ? 320
                  : "100%",

              maxWidth:
                isVertical
                  ? 360
                  : 900,
            }}
          >
            <Player
              component={
                VideoComponent
              }

              inputProps={
                inputProps
              }

              durationInFrames={
                durationInFrames
              }

              fps={
                quiz.fps
              }

              compositionWidth={
                width
              }

              compositionHeight={
                height
              }

              controls

              loop

              style={{
                width:
                  "100%",

                aspectRatio:
                  `${width} / ${height}`,

                borderRadius:
                  18,

                overflow:
                  "hidden",
              }}
            />
          </div>
        ) : (
          <div className="text-center">
            <p className="font-bold text-zinc-400">
              Nenhuma pergunta para visualizar
            </p>

            <p className="mt-2 text-sm text-zinc-600">
              Adicione uma pergunta ao projeto.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}