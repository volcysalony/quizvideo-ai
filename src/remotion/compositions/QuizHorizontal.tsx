import React from "react";

import {
  Sequence,
  useVideoConfig,
} from "remotion";

import type {
  QuizVideoProps,
} from "../types/quiz";

import {
  QuizQuestionHorizontal,
} from "../components/QuizQuestionHorizontal";

export const QuizHorizontal: React.FC<
  QuizVideoProps
> = ({
  title,
  introSeconds,
  countdownSeconds,
  revealSeconds,
  questions,
}) => {
  const { fps } =
    useVideoConfig();

  const secondsPerQuestion =
    introSeconds +
    countdownSeconds +
    revealSeconds;

  const questionDuration =
    Math.round(
      fps *
        secondsPerQuestion
    );

  return (
    <>
      {questions.map(
        (
          question,
          index
        ) => (
          <Sequence
            key={question.id}
            from={
              index *
              questionDuration
            }
            durationInFrames={
              questionDuration
            }
          >
            <QuizQuestionHorizontal
              quizTitle={title}
              question={
                question
              }
              fps={fps}
              introSeconds={
                introSeconds
              }
              countdownSeconds={
                countdownSeconds
              }
            />
          </Sequence>
        )
      )}
    </>
  );
};