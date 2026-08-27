import {
  NextResponse,
} from "next/server";

import {
  revalidatePath,
} from "next/cache";

import {
  prisma,
} from "@/database/prisma";

import {
  parseQuizText,
} from "@/features/questions/quizTextParser";

export const runtime =
  "nodejs";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

type ImportMode =
  | "APPEND"
  | "REPLACE";

const COLORS = [
  "#9333EA",
  "#2563EB",
  "#DB2777",
  "#EA580C",
  "#059669",
  "#0891B2",
];

function normalizeText(
  value: string
) {
  return value
    .trim()
    .toLocaleLowerCase(
      "pt-BR"
    )
    .replace(
      /\s+/g,
      " "
    );
}

export async function POST(
  request: Request,
  {
    params,
  }: Props
) {
  try {
    const {
      id: projectId,
    } = await params;

    /*
     * ===================================================
     * BODY
     * ===================================================
     */

    const body =
      (await request.json()) as {
        rawText?: unknown;
        mode?: unknown;
      };

    if (
      typeof body.rawText !==
      "string"
    ) {
      return NextResponse.json(
        {
          message:
            "O texto das perguntas é obrigatório.",
        },
        {
          status: 400,
        }
      );
    }

    const mode: ImportMode =
      body.mode ===
      "REPLACE"
        ? "REPLACE"
        : "APPEND";

    /*
     * ===================================================
     * PROJETO
     * ===================================================
     */

    const project =
      await prisma.project.findUnique({
        where: {
          id:
            projectId,
        },

        select: {
          id:
            true,
        },
      });

    if (!project) {
      return NextResponse.json(
        {
          message:
            "Projeto não encontrado.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * ===================================================
     * NÃO ALTERAR PERGUNTAS DURANTE RENDER
     * ===================================================
     */

    const activeRender =
      await prisma.render.findFirst({
        where: {
          projectId,

          status: {
            in: [
              "PENDING",
              "RENDERING",
            ],
          },
        },

        select: {
          id:
            true,
        },
      });

    if (
      activeRender
    ) {
      return NextResponse.json(
        {
          message:
            "Existe uma renderização em andamento. Aguarde a conclusão antes de importar perguntas.",
        },
        {
          status: 409,
        }
      );
    }

    /*
     * ===================================================
     * VALIDA NOVAMENTE NO BACKEND
     * ===================================================
     *
     * A validação feita no navegador serve
     * apenas para UX.
     *
     * O backend nunca confia nela.
     */

    const parsed =
      parseQuizText(
        body.rawText
      );

    if (!parsed.valid) {
      return NextResponse.json(
        {
          message:
            "O texto contém erros e não pode ser importado.",

          issues:
            parsed.issues,
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ===================================================
     * BLOQUEIA DUPLICATAS DO PROJETO
     * NO MODO APPEND
     * ===================================================
     */

    if (
      mode ===
      "APPEND"
    ) {
      const existingQuestions =
        await prisma.question.findMany({
          where: {
            projectId,
          },

          select: {
            text:
              true,
          },
        });

      const existingSet =
        new Set(
          existingQuestions.map(
            (
              question
            ) =>
              normalizeText(
                question.text
              )
          )
        );

      const duplicates =
        parsed.questions.filter(
          (
            question
          ) =>
            existingSet.has(
              normalizeText(
                question.text
              )
            )
        );

      if (
        duplicates.length >
        0
      ) {
        return NextResponse.json(
          {
            message:
              `${duplicates.length} pergunta(s) já existem neste projeto.`,

            duplicates:
              duplicates
                .slice(
                  0,
                  10
                )
                .map(
                  (
                    question
                  ) =>
                    question.text
                ),
          },
          {
            status: 409,
          }
        );
      }
    }

    /*
     * ===================================================
     * TRANSAÇÃO
     * ===================================================
     *
     * Ou todas entram,
     * ou nenhuma entra.
     */

    const result =
      await prisma.$transaction(
        async (
          tx
        ) => {
          if (
            mode ===
            "REPLACE"
          ) {
            await tx.question.deleteMany({
              where: {
                projectId,
              },
            });
          }

          /*
           * Descobre a posição inicial.
           */
          const lastQuestion =
            mode ===
            "APPEND"
              ? await tx.question.findFirst({
                  where: {
                    projectId,
                  },

                  orderBy: {
                    position:
                      "desc",
                  },

                  select: {
                    position:
                      true,
                  },
                })
              : null;

          const startPosition =
            lastQuestion
              ? lastQuestion.position +
                1
              : 0;

          for (
            let index = 0;
            index <
            parsed.questions
              .length;
            index++
          ) {
            const question =
              parsed.questions[
                index
              ];

            const position =
              startPosition +
              index;

            await tx.question.create({
              data: {
                projectId,

                text:
                  question.text,

                correctAnswer:
                  question.correctAnswer,

                backgroundColor:
                  COLORS[
                    position %
                      COLORS.length
                  ],

                position,

                options: {
                  create: [
                    {
                      text:
                        question.options[0],

                      position:
                        0,
                    },
                    {
                      text:
                        question.options[1],

                      position:
                        1,
                    },
                    {
                      text:
                        question.options[2],

                      position:
                        2,
                    },
                  ],
                },
              },
            });
          }

          const totalQuestions =
            await tx.question.count({
              where: {
                projectId,
              },
            });

          return {
            importedCount:
              parsed.questions.length,

            totalQuestions,
          };
        }
      );

    /*
     * ===================================================
     * INVALIDA AS TELAS
     * ===================================================
     */

    revalidatePath(
      `/projetos/${projectId}`
    );

    revalidatePath(
      `/projetos/${projectId}/importar`
    );

    revalidatePath(
      `/projetos/${projectId}/renderizar`
    );

    revalidatePath(
      "/projetos"
    );

    return NextResponse.json({
      success:
        true,

      importedCount:
        result.importedCount,

      totalQuestions:
        result.totalQuestions,

      message:
        `${result.importedCount} pergunta(s) importada(s) com sucesso.`,
    });
  } catch (error) {
    console.error(
      "Erro ao importar perguntas:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Não foi possível importar as perguntas.",
      },
      {
        status: 500,
      }
    );
  }
}