import React from "react";

import {
  type CalculateMetadataFunction,
  Composition,
} from "remotion";

import {
  QuizVertical,
} from "./compositions/QuizVertical";

import {
  QuizHorizontal,
} from "./compositions/QuizHorizontal";

import {
  demoQuiz,
} from "./data/demoQuiz";

import type {
  QuizVideoProps,
} from "./types/quiz";

const calculateDuration =
  (
    props: QuizVideoProps
  ) => {
    const secondsPerQuestion =
      props.introSeconds +
      props.countdownSeconds +
      props.revealSeconds;

    return Math.max(
      1,

      Math.ceil(
        props.questions.length *
          secondsPerQuestion *
          props.fps
      )
    );
  };

const calculateVerticalMetadata: CalculateMetadataFunction<
  QuizVideoProps
> = ({
  props,
}) => {
  return {
    durationInFrames:
      calculateDuration(
        props
      ),

    fps:
      props.fps,

    width:
      1080,

    height:
      1920,
  };
};

const calculateHorizontalMetadata: CalculateMetadataFunction<
  QuizVideoProps
> = ({
  props,
}) => {
  return {
    durationInFrames:
      calculateDuration(
        props
      ),

    fps:
      props.fps,

    width:
      1920,

    height:
      1080,
  };
};

export const RemotionRoot: React.FC =
  () => {
    return (
      <>
        {/* VERTICAL */}

        <Composition
          id="QuizVertical"

          component={
            QuizVertical
          }

          width={
            1080
          }

          height={
            1920
          }

          fps={
            30
          }

          durationInFrames={
            30 *
            9 *
            3
          }

          defaultProps={
            demoQuiz
          }

          calculateMetadata={
            calculateVerticalMetadata
          }
        />

        {/* HORIZONTAL */}

        <Composition
          id="QuizHorizontal"

          component={
            QuizHorizontal
          }

          width={
            1920
          }

          height={
            1080
          }

          fps={
            30
          }

          durationInFrames={
            30 *
            9 *
            3
          }

          defaultProps={
            demoQuiz
          }

          calculateMetadata={
            calculateHorizontalMetadata
          }
        />
      </>
    );
  };