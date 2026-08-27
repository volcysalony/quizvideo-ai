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

import {
  detectImageFormat,
  MAX_IMAGE_SIZE_BYTES,
} from "@/features/media/imageUpload";

export type QuestionImageState = {
  success: boolean;
  message: string;
  imagePath?: string | null;
  submissionId: number;
};

type ImageFit =
  | "COVER"
  | "CONTAIN";

type ImageFramingInput = {
  fit: ImageFit;
  positionX: number;
  positionY: number;
  scale: number;
};

type ImageFramingResult = {
  success: boolean;
  message: string;
  framing?: ImageFramingInput;
};

async function getQuestion(
  projectId: string,
  questionId: string
) {
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

        imageFit:
          true,

        imagePositionX:
          true,

        imagePositionY:
          true,

        imageScale:
          true,
      },
    });

  if (
    !question ||
    question.projectId !==
      projectId
  ) {
    return null;
  }

  return question;
}

function validateFraming(
  input: ImageFramingInput
) {
  if (
    input.fit !==
      "COVER" &&
    input.fit !==
      "CONTAIN"
  ) {
    return null;
  }

  const positionX =
    Number(
      input.positionX
    );

  const positionY =
    Number(
      input.positionY
    );

  const scale =
    Number(
      input.scale
    );

  if (
    !Number.isFinite(
      positionX
    ) ||
    !Number.isFinite(
      positionY
    ) ||
    !Number.isFinite(
      scale
    ) ||
    positionX < 0 ||
    positionX > 100 ||
    positionY < 0 ||
    positionY > 100 ||
    scale < 1 ||
    scale > 3
  ) {
    return null;
  }

  return {
    fit:
      input.fit,

    positionX,

    positionY,

    scale,
  };
}

/*
 * ENQUADRAMENTO
 */

export async function getQuestionImageFraming(
  projectId: string,
  questionId: string
): Promise<ImageFramingResult> {
  const question =
    await getQuestion(
      projectId,
      questionId
    );

  if (
    !question ||
    !question.imagePath
  ) {
    return {
      success:
        false,

      message:
        "Imagem da pergunta não encontrada.",
    };
  }

  return {
    success:
      true,

    message:
      "Enquadramento carregado.",

    framing: {
      fit:
        question.imageFit ===
        "COVER"
          ? "COVER"
          : "CONTAIN",

      positionX:
        question.imagePositionX,

      positionY:
        question.imagePositionY,

      scale:
        question.imageScale,
    },
  };
}

export async function updateQuestionImageFraming(
  projectId: string,
  questionId: string,
  input: ImageFramingInput
): Promise<ImageFramingResult> {
  try {
    const framing =
      validateFraming(
        input
      );

    if (!framing) {
      return {
        success:
          false,

        message:
          "Configuração de imagem inválida.",
      };
    }

    const question =
      await getQuestion(
        projectId,
        questionId
      );

    if (
      !question ||
      !question.imagePath
    ) {
      return {
        success:
          false,

        message:
          "Imagem da pergunta não encontrada.",
      };
    }

    await prisma.question.update({
      where: {
        id:
          questionId,
      },

      data: {
        imageFit:
          framing.fit,

        imagePositionX:
          framing.positionX,

        imagePositionY:
          framing.positionY,

        imageScale:
          framing.scale,
      },
    });

    revalidatePath(
      `/projetos/${projectId}`
    );

    return {
      success:
        true,

      message:
        "Enquadramento salvo.",

      framing,
    };
  } catch (error) {
    console.error(
      "Erro ao salvar enquadramento:",
      error
    );

    return {
      success:
        false,

      message:
        "Não foi possível salvar o enquadramento.",
    };
  }
}

/*
 * UPLOAD
 */

export async function uploadQuestionImageCompact(
  projectId: string,
  questionId: string,
  _previousState: QuestionImageState,
  formData: FormData
): Promise<QuestionImageState> {
  try {
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

    if (
      file.size ===
      0
    ) {
      return {
        success:
          false,

        message:
          "O arquivo está vazio.",

        submissionId:
          Date.now(),
      };
    }

    if (
      file.size >
      MAX_IMAGE_SIZE_BYTES
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

    const question =
      await getQuestion(
        projectId,
        questionId
      );

    if (!question) {
      return {
        success:
          false,

        message:
          "Pergunta não encontrada.",

        submissionId:
          Date.now(),
      };
    }

    const buffer =
      Buffer.from(
        await file.arrayBuffer()
      );

    const format =
      detectImageFormat(
        buffer
      );

    if (!format) {
      return {
        success:
          false,

        message:
          "Formato não suportado. Use JPG, PNG, WEBP, GIF ou AVIF.",

        submissionId:
          Date.now(),
      };
    }

    const directory =
      join(
        process.cwd(),
        "public",
        "uploads",
        "questions"
      );

    await mkdir(
      directory,
      {
        recursive:
          true,
      }
    );

    const fileName =
      `${questionId}-${randomUUID()}.${format.extension}`;

    const absolutePath =
      join(
        directory,
        fileName
      );

    await writeFile(
      absolutePath,
      buffer
    );

    const publicPath =
      `/uploads/questions/${fileName}`;

    try {
      await prisma.question.update({
        where: {
          id:
            questionId,
        },

        data: {
          imagePath:
            publicPath,

          imageFit:
            "CONTAIN",

          imagePositionX:
            50,

          imagePositionY:
            50,

          imageScale:
            1,
        },
      });
    } catch (
      databaseError
    ) {
      try {
        await unlink(
          absolutePath
        );
      } catch {
        // Nada.
      }

      throw databaseError;
    }

    if (
      question.imagePath &&
      question.imagePath.startsWith(
        "/uploads/questions/"
      )
    ) {
      try {
        await unlink(
          join(
            directory,
            basename(
              question.imagePath
            )
          )
        );
      } catch {
        // Nada.
      }
    }

    revalidatePath(
      `/projetos/${projectId}`
    );

    return {
      success:
        true,

      message:
        "Imagem da pergunta salva.",

      imagePath:
        publicPath,

      submissionId:
        Date.now(),
    };
  } catch (error) {
    console.error(
      "Erro ao enviar imagem da pergunta:",
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

/*
 * REMOVER
 */

export async function removeQuestionImage(
  projectId: string,
  questionId: string,
  _previousState: QuestionImageState,
  _formData: FormData
): Promise<QuestionImageState> {
  try {
    const question =
      await getQuestion(
        projectId,
        questionId
      );

    if (!question) {
      return {
        success:
          false,

        message:
          "Pergunta não encontrada.",

        submissionId:
          Date.now(),
      };
    }

    await prisma.question.update({
      where: {
        id:
          questionId,
      },

      data: {
        imagePath:
          null,

        imageFit:
          "CONTAIN",

        imagePositionX:
          50,

        imagePositionY:
          50,

        imageScale:
          1,
      },
    });

    if (
      question.imagePath &&
      question.imagePath.startsWith(
        "/uploads/questions/"
      )
    ) {
      try {
        await unlink(
          join(
            process.cwd(),
            "public",
            "uploads",
            "questions",
            basename(
              question.imagePath
            )
          )
        );
      } catch {
        // Nada.
      }
    }

    revalidatePath(
      `/projetos/${projectId}`
    );

    return {
      success:
        true,

      message:
        "Imagem removida.",

      imagePath:
        null,

      submissionId:
        Date.now(),
    };
  } catch (error) {
    console.error(
      "Erro ao remover imagem da pergunta:",
      error
    );

    return {
      success:
        false,

      message:
        "Não foi possível remover a imagem.",

      submissionId:
        Date.now(),
    };
  }
}