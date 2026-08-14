"use server";

import {
  mkdir,
  unlink,
  writeFile,
} from "node:fs/promises";

import {
  basename,
  join,
} from "node:path";

import {
  randomUUID,
} from "node:crypto";

import {
  revalidatePath,
} from "next/cache";

import {
  prisma,
} from "@/database/prisma";

/*
 * =========================================================
 * CONFIGURAÇÕES
 * =========================================================
 */

const DEFAULT_COLORS = [
  "#9333EA",
  "#22C55E",
  "#FACC15",
  "#2563EB",
  "#F97316",
  "#EF4444",
];

const ALLOWED_FORMATS = [
  "VERTICAL",
  "HORIZONTAL",
] as const;

const ALLOWED_COUNTDOWN_SECONDS = [
  3,
  4,
  5,
  6,
  7,
  8,
];

const ALLOWED_REVEAL_SECONDS = [
  1,
  2,
  3,
  4,
];

const MAX_IMAGE_SIZE =
  8 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

/*
 * =========================================================
 * TIPOS
 * =========================================================
 */

export type UpdateProjectState = {
  success: boolean;
  message: string;
  submissionId: number;
};

export type UploadQuestionImageState = {
  success: boolean;
  message: string;
  imagePath?: string;
  submissionId: number;
};

/*
 * =========================================================
 * ATUALIZAR PROJETO
 * =========================================================
 */

export async function updateProject(
  projectId: string,
  _previousState: UpdateProjectState,
  formData: FormData
): Promise<UpdateProjectState> {
  try {
    const title = String(
      formData.get("title") ?? ""
    ).trim();

    const format = String(
      formData.get("format") ?? ""
    );

    const countdownSeconds =
      Number(
        formData.get(
          "countdownSeconds"
        )
      );

    const revealSeconds =
      Number(
        formData.get(
          "revealSeconds"
        )
      );

    /*
     * TÍTULO
     */

    if (!title) {
      return {
        success: false,

        message:
          "O título do quiz é obrigatório.",

        submissionId:
          Date.now(),
      };
    }

    /*
     * FORMATO
     */

    if (
      !ALLOWED_FORMATS.includes(
        format as
          (typeof ALLOWED_FORMATS)[number]
      )
    ) {
      return {
        success: false,

        message:
          "Formato de vídeo inválido.",

        submissionId:
          Date.now(),
      };
    }

    /*
     * CONTAGEM
     */

    if (
      !ALLOWED_COUNTDOWN_SECONDS.includes(
        countdownSeconds
      )
    ) {
      return {
        success: false,

        message:
          "Tempo de contagem inválido.",

        submissionId:
          Date.now(),
      };
    }

    /*
     * TEMPO DE RESPOSTA
     */

    if (
      !ALLOWED_REVEAL_SECONDS.includes(
        revealSeconds
      )
    ) {
      return {
        success: false,

        message:
          "Tempo de exibição da resposta inválido.",

        submissionId:
          Date.now(),
      };
    }

    /*
     * RESOLUÇÃO
     */

    const isVertical =
      format === "VERTICAL";

    const width =
      isVertical
        ? 1080
        : 1920;

    const height =
      isVertical
        ? 1920
        : 1080;

    /*
     * BANCO
     */

    await prisma.project.update({
      where: {
        id: projectId,
      },

      data: {
        title,

        format,

        width,

        height,

        countdownSeconds,

        revealSeconds,
      },
    });

    /*
     * REVALIDAÇÃO
     */

    revalidatePath(
      `/projetos/${projectId}`
    );

    revalidatePath(
      "/projetos"
    );

    return {
      success: true,

      message:
        "Configurações salvas com sucesso.",

      submissionId:
        Date.now(),
    };
  } catch (error) {
    console.error(
      "Erro ao atualizar projeto:",
      error
    );

    return {
      success: false,

      message:
        "Não foi possível salvar as configurações.",

      submissionId:
        Date.now(),
    };
  }
}

/*
 * =========================================================
 * ATUALIZAR PERGUNTA
 * =========================================================
 */

export async function updateQuestion(
  projectId: string,
  questionId: string,
  formData: FormData
) {
  const text = String(
    formData.get("text") ?? ""
  ).trim();

  const backgroundColor =
    String(
      formData.get(
        "backgroundColor"
      ) ?? "#9333EA"
    );

  const correctAnswer =
    Number(
      formData.get(
        "correctAnswer"
      )
    );

  if (!text) {
    throw new Error(
      "A pergunta não pode ficar vazia."
    );
  }

  const question =
    await prisma.question.findUnique({
      where: {
        id: questionId,
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
    throw new Error(
      "Pergunta não encontrada."
    );
  }

  await prisma.$transaction(
    async (tx) => {
      await tx.question.update({
        where: {
          id: questionId,
        },

        data: {
          text,

          backgroundColor,

          correctAnswer,
        },
      });

      for (
        const option of
        question.options
      ) {
        const optionText =
          String(
            formData.get(
              `option-${option.id}`
            ) ?? ""
          ).trim();

        await tx.option.update({
          where: {
            id:
              option.id,
          },

          data: {
            text:
              optionText,
          },
        });
      }
    }
  );

  revalidatePath(
    `/projetos/${projectId}`
  );
}

/*
 * =========================================================
 * ADICIONAR PERGUNTA
 * =========================================================
 */

export async function addQuestion(
  projectId: string
) {
  const lastQuestion =
    await prisma.question.findFirst({
      where: {
        projectId,
      },

      orderBy: {
        position:
          "desc",
      },
    });

  const position =
    (lastQuestion?.position ?? 0) +
    1;

  const color =
    DEFAULT_COLORS[
      (position - 1) %
        DEFAULT_COLORS.length
    ];

  await prisma.question.create({
    data: {
      projectId,

      text:
        "NOVA PERGUNTA",

      correctAnswer:
        0,

      backgroundColor:
        color,

      position,

      options: {
        create: [
          {
            text:
              "Alternativa A",

            position:
              0,
          },

          {
            text:
              "Alternativa B",

            position:
              1,
          },

          {
            text:
              "Alternativa C",

            position:
              2,
          },
        ],
      },
    },
  });

  revalidatePath(
    `/projetos/${projectId}`
  );

  revalidatePath(
    "/projetos"
  );
}

/*
 * =========================================================
 * EXCLUIR PERGUNTA
 * =========================================================
 */

export async function deleteQuestion(
  projectId: string,
  questionId: string
) {
  const question =
    await prisma.question.findUnique({
      where: {
        id:
          questionId,
      },
    });

  if (
    !question ||
    question.projectId !==
      projectId
  ) {
    throw new Error(
      "Pergunta não encontrada."
    );
  }

  /*
   * REMOVE A PERGUNTA
   */

  await prisma.question.delete({
    where: {
      id:
        questionId,
    },
  });

  /*
   * BUSCA AS RESTANTES
   */

  const remaining =
    await prisma.question.findMany({
      where: {
        projectId,
      },

      orderBy: {
        position:
          "asc",
      },
    });

  /*
   * RENUMERA
   */

  for (
    let index = 0;
    index <
    remaining.length;
    index++
  ) {
    await prisma.question.update({
      where: {
        id:
          remaining[index].id,
      },

      data: {
        position:
          index + 1,
      },
    });
  }

  revalidatePath(
    `/projetos/${projectId}`
  );

  revalidatePath(
    "/projetos"
  );
}

/*
 * =========================================================
 * UPLOAD DA IMAGEM DA PERGUNTA
 * =========================================================
 */

export async function uploadQuestionImage(
  projectId: string,
  questionId: string,
  _previousState: UploadQuestionImageState,
  formData: FormData
): Promise<UploadQuestionImageState> {
  try {
    /*
     * ARQUIVO
     */

    const file =
      formData.get(
        "image"
      );

    if (
      !(file instanceof File)
    ) {
      return {
        success:
          false,

        message:
          "Selecione uma imagem.",

        submissionId:
          Date.now(),
      };
    }

    /*
     * ARQUIVO VAZIO
     */

    if (
      file.size === 0
    ) {
      return {
        success:
          false,

        message:
          "O arquivo selecionado está vazio.",

        submissionId:
          Date.now(),
      };
    }

    /*
     * TAMANHO
     */

    if (
      file.size >
      MAX_IMAGE_SIZE
    ) {
      return {
        success:
          false,

        message:
          "A imagem deve ter no máximo 8 MB.",

        submissionId:
          Date.now(),
      };
    }

    /*
     * TIPO
     */

    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type
      )
    ) {
      return {
        success:
          false,

        message:
          "Use uma imagem JPG, PNG ou WEBP.",

        submissionId:
          Date.now(),
      };
    }

    /*
     * CONFIRMA A PERGUNTA
     */

    const question =
      await prisma.question.findUnique({
        where: {
          id:
            questionId,
        },

        select: {
          id:
            true,

          projectId:
            true,

          imagePath:
            true,
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

    /*
     * EXTENSÃO
     */

    const extensionByType: Record<
      string,
      string
    > = {
      "image/jpeg":
        "jpg",

      "image/png":
        "png",

      "image/webp":
        "webp",
    };

    const extension =
      extensionByType[
        file.type
      ];

    /*
     * NOME ÚNICO
     */

    const fileName =
      `${questionId}-${randomUUID()}.${extension}`;

    /*
     * DIRETÓRIO
     */

    const uploadDirectory =
      join(
        process.cwd(),

        "public",

        "uploads",

        "questions"
      );

    await mkdir(
      uploadDirectory,
      {
        recursive:
          true,
      }
    );

    /*
     * ARQUIVO FINAL
     */

    const absolutePath =
      join(
        uploadDirectory,
        fileName
      );

    const buffer =
      Buffer.from(
        await file.arrayBuffer()
      );

    await writeFile(
      absolutePath,
      buffer
    );

    /*
     * URL PÚBLICA
     */

    const publicPath =
      `/uploads/questions/${fileName}`;

    /*
     * SALVA NO SQLITE
     */

    await prisma.question.update({
      where: {
        id:
          questionId,
      },

      data: {
        imagePath:
          publicPath,
      },
    });

    /*
     * REMOVE IMAGEM ANTIGA
     */

    if (
      question.imagePath &&
      question.imagePath.startsWith(
        "/uploads/questions/"
      )
    ) {
      const oldFileName =
        basename(
          question.imagePath
        );

      const oldAbsolutePath =
        join(
          uploadDirectory,
          oldFileName
        );

      try {
        await unlink(
          oldAbsolutePath
        );
      } catch {
        /*
         * Não interrompe o upload
         * se a imagem antiga
         * já tiver sido removida.
         */
      }
    }

    /*
     * ATUALIZA A PÁGINA
     */

    revalidatePath(
      `/projetos/${projectId}`
    );

    return {
      success:
        true,

      message:
        "Imagem salva com sucesso.",

      imagePath:
        publicPath,

      submissionId:
        Date.now(),
    };
  } catch (error) {
    console.error(
      "Erro ao enviar imagem:",
      error
    );

    return {
      success:
        false,

      message:
        "Não foi possível enviar a imagem.",

      submissionId:
        Date.now(),
    };
  }
}