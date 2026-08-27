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

export type OptionImageState = {
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

async function getOption(
  projectId: string,
  questionId: string,
  optionId: string
) {
  const option =
    await prisma.option.findUnique({
      where: {
        id:
          optionId,
      },

      select: {
        id:
          true,

        questionId:
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

        question: {
          select: {
            projectId:
              true,
          },
        },
      },
    });

  if (
    !option ||
    option.questionId !==
      questionId ||
    option.question.projectId !==
      projectId
  ) {
    return null;
  }

  return option;
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
    )
  ) {
    return null;
  }

  if (
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
 * =========================================================
 * CONSULTAR ENQUADRAMENTO
 * =========================================================
 */

export async function getOptionImageFraming(
  projectId: string,
  questionId: string,
  optionId: string
): Promise<ImageFramingResult> {
  const option =
    await getOption(
      projectId,
      questionId,
      optionId
    );

  if (
    !option ||
    !option.imagePath
  ) {
    return {
      success:
        false,

      message:
        "Imagem da alternativa não encontrada.",
    };
  }

  return {
    success:
      true,

    message:
      "Enquadramento carregado.",

    framing: {
      fit:
        option.imageFit ===
        "CONTAIN"
          ? "CONTAIN"
          : "COVER",

      positionX:
        option.imagePositionX,

      positionY:
        option.imagePositionY,

      scale:
        option.imageScale,
    },
  };
}

/*
 * =========================================================
 * SALVAR ENQUADRAMENTO
 * =========================================================
 */

export async function updateOptionImageFraming(
  projectId: string,
  questionId: string,
  optionId: string,
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

    const option =
      await getOption(
        projectId,
        questionId,
        optionId
      );

    if (
      !option ||
      !option.imagePath
    ) {
      return {
        success:
          false,

        message:
          "Imagem da alternativa não encontrada.",
      };
    }

    await prisma.option.update({
      where: {
        id:
          optionId,
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
      "Erro ao salvar enquadramento da alternativa:",
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
 * =========================================================
 * UPLOAD / TROCAR
 * =========================================================
 */

export async function uploadOptionImage(
  projectId: string,
  questionId: string,
  optionId: string,
  _previousState: OptionImageState,
  formData: FormData
): Promise<OptionImageState> {
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
          "O arquivo selecionado está vazio.",

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

    const option =
      await getOption(
        projectId,
        questionId,
        optionId
      );

    if (!option) {
      return {
        success:
          false,

        message:
          "Alternativa não encontrada.",

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
        "options"
      );

    await mkdir(
      directory,
      {
        recursive:
          true,
      }
    );

    const fileName =
      `${optionId}-${randomUUID()}.${format.extension}`;

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
      `/uploads/options/${fileName}`;

    try {
      await prisma.option.update({
        where: {
          id:
            optionId,
        },

        data: {
          imagePath:
            publicPath,

          /*
           * Nova imagem =
           * novo enquadramento.
           */
          imageFit:
            "COVER",

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
      option.imagePath &&
      option.imagePath.startsWith(
        "/uploads/options/"
      )
    ) {
      try {
        await unlink(
          join(
            directory,
            basename(
              option.imagePath
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
        "Imagem salva.",

      imagePath:
        publicPath,

      submissionId:
        Date.now(),
    };
  } catch (error) {
    console.error(
      "Erro ao enviar imagem da alternativa:",
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
 * =========================================================
 * REMOVER
 * =========================================================
 */

export async function removeOptionImage(
  projectId: string,
  questionId: string,
  optionId: string,
  _previousState: OptionImageState,
  _formData: FormData
): Promise<OptionImageState> {
  try {
    const option =
      await getOption(
        projectId,
        questionId,
        optionId
      );

    if (!option) {
      return {
        success:
          false,

        message:
          "Alternativa não encontrada.",

        submissionId:
          Date.now(),
      };
    }

    if (
      !option.imagePath
    ) {
      return {
        success:
          true,

        message:
          "A alternativa já não possui imagem.",

        imagePath:
          null,

        submissionId:
          Date.now(),
      };
    }

    await prisma.option.update({
      where: {
        id:
          optionId,
      },

      data: {
        imagePath:
          null,

        imageFit:
          "COVER",

        imagePositionX:
          50,

        imagePositionY:
          50,

        imageScale:
          1,
      },
    });

    if (
      option.imagePath.startsWith(
        "/uploads/options/"
      )
    ) {
      try {
        await unlink(
          join(
            process.cwd(),
            "public",
            "uploads",
            "options",
            basename(
              option.imagePath
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
      "Erro ao remover imagem:",
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