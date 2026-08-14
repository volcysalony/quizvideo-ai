import { prisma } from "@/database/prisma";
import type { QuizVideoProps } from "@/remotion/types/quiz";

export async function getProjectForRender(
  projectId: string
): Promise<QuizVideoProps> {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },

    include: {
      questions: {
        orderBy: {
          position: "asc",
        },

        include: {
          options: {
            orderBy: {
              position: "asc",
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

  if (project.questions.length === 0) {
    throw new Error(
      "O projeto não possui perguntas."
    );
  }

  return {
    title: project.title,

    fps: project.fps,

    introSeconds: project.introSeconds,
    countdownSeconds:
      project.countdownSeconds,
    revealSeconds:
      project.revealSeconds,

    questions: project.questions.map(
      (question) => ({
        id: question.id,

        question: question.text,

        image:
          question.imagePath ??
          undefined,

        correctAnswer:
          question.correctAnswer,

        backgroundColor:
          question.backgroundColor,

        options: question.options.map(
          (option) => ({
            text: option.text,

            image:
              option.imagePath ??
              undefined,
          })
        ),
      })
    ),
  };
}