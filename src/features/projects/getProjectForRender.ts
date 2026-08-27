import {
  prisma,
} from "@/database/prisma";

import type {
  QuizVideoProps,
} from "@/remotion/types/quiz";

export async function getProjectForRender(
  projectId: string
): Promise<QuizVideoProps> {
  const project =
    await prisma.project.findUnique({
      where: {
        id:
          projectId,
      },

      include: {
        questions: {
          orderBy: {
            position:
              "asc",
          },

          include: {
            options: {
              orderBy: {
                position:
                  "asc",
              },
            },
          },
        },
      },
    });

  if (!project) {
    throw new Error(
      `Projeto não encontrado: ${projectId}`
    );
  }

  if (
    project.questions.length ===
    0
  ) {
    throw new Error(
      "O projeto não possui perguntas."
    );
  }

  /*
   * Não permitimos gerar um vídeo
   * visual incompleto.
   */
  for (
    const question
    of project.questions
  ) {
    const usesImages =
      question.answerMode ===
        "IMAGE" ||
      question.answerMode ===
        "IMAGE_TEXT";

    if (!usesImages) {
      continue;
    }

    const missingOption =
      question.options.find(
        (option) =>
          !option.imagePath
      );

    if (missingOption) {
      const letter =
        String.fromCharCode(
          65 +
            missingOption.position
        );

      throw new Error(
        `A pergunta ${question.position} usa alternativas com imagens, mas a alternativa ${letter} não possui imagem.`
      );
    }
  }

  return {
    title:
      project.title,

    fps:
      project.fps,

    introSeconds:
      project.introSeconds,

    countdownSeconds:
      project.countdownSeconds,

    revealSeconds:
      project.revealSeconds,

    questions:
      project.questions.map(
        (question) => ({
          id:
            question.id,

          question:
            question.text,

          image:
            question.imagePath ??
            undefined,

          imageFit:
            question.imageFit ===
            "COVER"
              ? "COVER"
              : "CONTAIN",

          imagePositionX:
            question.imagePositionX,

          imagePositionY:
            question.imagePositionY,

          imageScale:
            question.imageScale,

          answerMode:
            question.answerMode as
              | "TEXT"
              | "IMAGE"
              | "IMAGE_TEXT",

          correctAnswer:
            question.correctAnswer,

          backgroundColor:
            question.backgroundColor,

          options:
            question.options.map(
              (option) => ({
                text:
                  option.text,

                image:
                  option.imagePath ??
                  undefined,

                imageFit:
                  option.imageFit ===
                  "CONTAIN"
                    ? "CONTAIN"
                    : "COVER",

                imagePositionX:
                  option.imagePositionX,

                imagePositionY:
                  option.imagePositionY,

                imageScale:
                  option.imageScale,
              })
            ),
        })
      ),
  };
}