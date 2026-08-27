"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  prisma,
} from "@/database/prisma";

const ANSWER_MODES = [
  "TEXT",
  "IMAGE",
  "IMAGE_TEXT",
] as const;

type AnswerMode =
  (typeof ANSWER_MODES)[number];

export type QuestionEditorState = {
  success: boolean;
  message: string;
  submissionId: number;
};

export async function updateQuestionDetails(
  projectId: string,
  questionId: string,
  _previousState: QuestionEditorState,
  formData: FormData
): Promise<QuestionEditorState> {
  try {
    const text =
      String(
        formData.get(
          "text"
        ) ?? ""
      ).trim();

    const backgroundColor =
      String(
        formData.get(
          "backgroundColor"
        ) ?? ""
      );

    const answerMode =
      String(
        formData.get(
          "answerMode"
        ) ?? "TEXT"
      ) as AnswerMode;

    const correctAnswer =
      Number(
        formData.get(
          "correctAnswer"
        )
      );

    if (!text) {
      return {
        success:
          false,

        message:
          "A pergunta não pode ficar vazia.",

        submissionId:
          Date.now(),
      };
    }

    if (
      !/^#[0-9A-Fa-f]{6}$/.test(
        backgroundColor
      )
    ) {
      return {
        success:
          false,

        message:
          "Cor de fundo inválida.",

        submissionId:
          Date.now(),
      };
    }

    if (
      !ANSWER_MODES.includes(
        answerMode
      )
    ) {
      return {
        success:
          false,

        message:
          "Modo das alternativas inválido.",

        submissionId:
          Date.now(),
      };
    }

    const question =
      await prisma.question.findUnique({
        where: {
          id:
            questionId,
        },

        include: {
          options: {
            orderBy: {
              position:
                "asc",
            },
          },
        },
      });

    if (
      !question ||
      question.projectId !==
        projectId
    ) {
      return {
        success:
          false,

        message:
          "Pergunta não encontrada.",

        submissionId:
          Date.now(),
      };
    }

    if (
      !question.options.some(
        (option) =>
          option.position ===
          correctAnswer
      )
    ) {
      return {
        success:
          false,

        message:
          "Selecione uma resposta correta.",

        submissionId:
          Date.now(),
      };
    }

    const options =
      question.options.map(
        (option) => {
          const value =
            String(
              formData.get(
                `option-${option.id}`
              ) ?? ""
            ).trim();

          return {
            ...option,

            /*
             * No modo somente imagem,
             * preservamos o texto existente
             * se o campo estiver vazio.
             */
            nextText:
              value ||
              option.text,
          };
        }
      );

    if (
      answerMode !==
      "IMAGE"
    ) {
      const emptyOption =
        options.find(
          (option) =>
            !String(
              formData.get(
                `option-${option.id}`
              ) ?? ""
            ).trim()
        );

      if (emptyOption) {
        return {
          success:
            false,

          message:
            "Todas as alternativas de texto devem ser preenchidas.",

          submissionId:
            Date.now(),
        };
      }
    }

    await prisma.$transaction(
      async (tx) => {
        await tx.question.update({
          where: {
            id:
              questionId,
          },

          data: {
            text,

            backgroundColor,

            answerMode,

            correctAnswer,
          },
        });

        for (
          const option
          of options
        ) {
          await tx.option.update({
            where: {
              id:
                option.id,
            },

            data: {
              text:
                option.nextText,
            },
          });
        }
      }
    );

    revalidatePath(
      `/projetos/${projectId}`
    );

    revalidatePath(
      `/projetos/${projectId}/renderizar`
    );

    return {
      success:
        true,

      message:
        "Pergunta salva.",

      submissionId:
        Date.now(),
    };
  } catch (error) {
    console.error(
      "Erro ao atualizar pergunta:",
      error
    );

    return {
      success:
        false,

      message:
        "Não foi possível salvar a pergunta.",

      submissionId:
        Date.now(),
    };
  }
}