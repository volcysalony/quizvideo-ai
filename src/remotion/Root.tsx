import React from "react";
import { Composition } from "remotion";
import { QuizVertical } from "./compositions/QuizVertical";

export const RemotionRoot: React.FC = () => {
  const fps = 30;
  const secondsPerQuestion = 9;
  const numberOfQuestions = 3;

  return (
    <>
      <Composition
        id="QuizVertical"
        component={QuizVertical}
        durationInFrames={
          fps * secondsPerQuestion * numberOfQuestions
        }
        fps={fps}
        width={1080}
        height={1920}
      />
    </>
  );
};