export type QuizQuestion = {
  id: number;
  question: string;
  image?: string;
  options: string[];
  correctAnswer: number;
  backgroundColor: string;
};

export const demoQuiz: QuizQuestion[] = [
  {
    id: 1,
    question: "ANSIEDADE PODE CAUSAR INSÔNIA?",
    options: [
      "Sim, é comum",
      "Raramente",
      "Nunca",
    ],
    correctAnswer: 0,
    backgroundColor: "#7C3AED",
  },
  {
    id: 2,
    question: "QUAL DESTES É UM PLANETA?",
    options: [
      "Marte",
      "Lua",
      "Sol",
    ],
    correctAnswer: 0,
    backgroundColor: "#22C55E",
  },
  {
    id: 3,
    question: "QUAL É A CAPITAL DO BRASIL?",
    options: [
      "São Paulo",
      "Brasília",
      "Rio de Janeiro",
    ],
    correctAnswer: 1,
    backgroundColor: "#FACC15",
  },
];