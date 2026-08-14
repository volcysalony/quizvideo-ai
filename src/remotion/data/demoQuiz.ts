import type { QuizVideoProps } from "../types/quiz";

export const demoQuiz: QuizVideoProps = {
  title: "QUIZ DE CONHECIMENTOS",

  fps: 30,

  introSeconds: 1,
  countdownSeconds: 6,
  revealSeconds: 2,

  questions: [
    {
      id: "1",

      question: "ANSIEDADE PODE CAUSAR INSÔNIA?",

      options: [
        {
          text: "Sim, é comum",
        },
        {
          text: "Raramente",
        },
        {
          text: "Nunca",
        },
      ],

      correctAnswer: 0,

      backgroundColor: "#9333EA",
    },

    {
      id: "2",

      question: "QUAL DESTES É UM PLANETA?",

      options: [
        {
          text: "Marte",
        },
        {
          text: "Lua",
        },
        {
          text: "Sol",
        },
      ],

      correctAnswer: 0,

      backgroundColor: "#22C55E",
    },

    {
      id: "3",

      question: "QUAL É A CAPITAL DO BRASIL?",

      options: [
        {
          text: "São Paulo",
        },
        {
          text: "Brasília",
        },
        {
          text: "Rio de Janeiro",
        },
      ],

      correctAnswer: 1,

      backgroundColor: "#FACC15",
    },
  ],
};