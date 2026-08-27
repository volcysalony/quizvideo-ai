export type QuizAnswerMode =
  | "TEXT"
  | "IMAGE"
  | "IMAGE_TEXT";

export type QuizImageFit =
  | "COVER"
  | "CONTAIN";

export type QuizOption = {
  text: string;

  image?: string;

  imageFit?: QuizImageFit;

  imagePositionX?: number;
  imagePositionY?: number;

  imageScale?: number;
};

export type QuizQuestion = {
  id: string;

  question: string;

  image?: string;

  imageFit?: QuizImageFit;

  imagePositionX?: number;
  imagePositionY?: number;

  imageScale?: number;

  answerMode?: QuizAnswerMode;

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