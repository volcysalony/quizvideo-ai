import React from "react";
import { classicQuizTheme } from "../templates/classicQuiz";

type Props = {
  letter: string;
  text: string;
  isCorrect?: boolean;
  showCorrect?: boolean;
};

export const AnswerOption: React.FC<Props> = ({
  letter,
  text,
  isCorrect = false,
  showCorrect = false,
}) => {
  const highlight = showCorrect && isCorrect;

  return (
    <div
      style={{
        position: "relative",

        display: "flex",
        alignItems: "center",

        width: "100%",
        minHeight: 150,

        padding: "18px 40px 18px 30px",

        boxSizing: "border-box",

        backgroundColor: highlight
          ? classicQuizTheme.correctColor
          : classicQuizTheme.answerBackground,

        border: "5px solid #111111",

        borderRadius: 34,

        boxShadow: classicQuizTheme.shadow,

        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      {/* Círculo A / B / C */}

      <div
        style={{
          width: 105,
          height: 105,

          flexShrink: 0,

          borderRadius: "50%",

          backgroundColor: highlight
            ? "#FFFFFF"
            : classicQuizTheme.optionCircleBackground,

          border: `5px solid ${classicQuizTheme.optionCircleBorder}`,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          boxSizing: "border-box",

          boxShadow: "0 5px 0 rgba(0,0,0,0.18)",
        }}
      >
        <span
          style={{
            fontSize: 67,
            lineHeight: 1,

            fontWeight: 900,

            color: highlight
              ? classicQuizTheme.correctColor
              : classicQuizTheme.optionCircleText,

            WebkitTextStroke: highlight
              ? "0px transparent"
              : "1px #FFFFFF",
          }}
        >
          {letter}
        </span>
      </div>

      {/* Texto */}

      <div
        style={{
          marginLeft: 32,

          fontSize: 52,
          fontWeight: 900,

          lineHeight: 1.08,

          color: highlight
            ? classicQuizTheme.correctTextColor
            : classicQuizTheme.answerTextColor,

          letterSpacing: "-1px",
        }}
      >
        {text}
      </div>

      {/* Ícone simples quando revelar */}

      {highlight && (
        <div
          style={{
            marginLeft: "auto",

            width: 62,
            height: 62,

            borderRadius: "50%",

            backgroundColor: "#FFFFFF",

            color: classicQuizTheme.correctColor,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            fontSize: 42,
            fontWeight: 900,
          }}
        >
          ✓
        </div>
      )}
    </div>
  );
};