export type QuizOption = {
  text: string;
  image?: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  image?: string;

  options: QuizOption[];

  correctAnswer: number;
  backgroundColor: string;
};

export type QuizVideoProps = {
  title: string;

  fps: number;

  introSeconds: number;
  countdownSeconds: number;
  revealSeconds: number;

  questions: QuizQuestion[];
};