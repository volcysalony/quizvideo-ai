import React from "react";
import { Sequence, useVideoConfig } from "remotion";
import { demoQuiz } from "../data/demoQuiz";
import { QuizQuestion } from "../components/QuizQuestion";

export const QuizVertical: React.FC = () => {
  const { fps } = useVideoConfig();

  const questionDuration = fps * 9;

  return (
    <>
      {demoQuiz.map((question, index) => (
        <Sequence
          key={question.id}
          from={index * questionDuration}
          durationInFrames={questionDuration}
        >
          <QuizQuestion
            question={question}
            fps={fps}
          />
        </Sequence>
      ))}
    </>
  );
};