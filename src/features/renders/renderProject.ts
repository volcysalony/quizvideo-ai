import {
  mkdir,
} from "node:fs/promises";

import path from "node:path";

import {
  bundle,
} from "@remotion/bundler";

import {
  renderMedia,
  selectComposition,
} from "@remotion/renderer";

import {
  prisma,
} from "@/database/prisma";

import {
  getProjectForRender,
} from "@/features/projects/getProjectForRender";

type RenderProjectResult = {
  outputPath: string;
};

export async function renderProject(
  projectId: string,
  renderId: string
): Promise<RenderProjectResult> {
  try {
    /*
     * =====================================================
     * PROJETO
     * =====================================================
     */

    const project =
      await prisma.project.findUnique({
        where: {
          id: projectId,
        },

        select: {
          id: true,
          title: true,
          format: true,
        },
      });

    if (!project) {
      throw new Error(
        `Projeto não encontrado: ${projectId}`
      );
    }

    /*
     * =====================================================
     * MARCA O INÍCIO
     * =====================================================
     */

    await prisma.render.update({
      where: {
        id: renderId,
      },

      data: {
        status: "RENDERING",
        progress: 1,
        startedAt: new Date(),
        errorMessage: null,
      },
    });

    /*
     * =====================================================
     * PROPS
     * =====================================================
     */

    const inputProps =
      await getProjectForRender(
        projectId
      );

    if (
      inputProps.questions.length === 0
    ) {
      throw new Error(
        "O projeto não possui perguntas para renderizar."
      );
    }

    /*
     * =====================================================
     * COMPOSIÇÃO
     * =====================================================
     */

    const compositionId =
      project.format ===
      "HORIZONTAL"
        ? "QuizHorizontal"
        : "QuizVertical";

    /*
     * =====================================================
     * BUNDLE
     * =====================================================
     */

    await prisma.render.update({
      where: {
        id: renderId,
      },

      data: {
        progress: 3,
      },
    });

    console.log(
      `📦 Criando bundle para ${compositionId}...`
    );

    const serveUrl =
      await bundle({
        entryPoint:
          path.resolve(
            process.cwd(),
            "src",
            "remotion",
            "index.ts"
          ),

        webpackOverride:
          (config) =>
            config,
      });

    /*
     * =====================================================
     * METADATA
     * =====================================================
     */

    await prisma.render.update({
      where: {
        id: renderId,
      },

      data: {
        progress: 5,
      },
    });

    const composition =
      await selectComposition({
        serveUrl,

        id:
          compositionId,

        inputProps,
      });

    /*
     * =====================================================
     * OUTPUT
     * =====================================================
     */

    const safeTitle =
      inputProps.title
        .toLowerCase()
        .normalize("NFD")
        .replace(
          /[\u0300-\u036f]/g,
          ""
        )
        .replace(
          /[^a-z0-9]+/g,
          "-"
        )
        .replace(
          /^-|-$/g,
          ""
        ) || "quiz";

    const formatSuffix =
      project.format ===
      "HORIZONTAL"
        ? "horizontal"
        : "vertical";

    const relativeOutputPath =
      path.join(
        "storage",
        "renders",
        `${safeTitle}-${formatSuffix}-${renderId}.mp4`
      );

    const absoluteOutputPath =
      path.resolve(
        process.cwd(),
        relativeOutputPath
      );

    await mkdir(
      path.dirname(
        absoluteOutputPath
      ),
      {
        recursive: true,
      }
    );

    /*
     * =====================================================
     * RENDER
     * =====================================================
     */

    console.log(
      `🎬 Renderizando ${project.title}...`
    );

    let lastSavedProgress =
      5;

    await renderMedia({
      composition,

      serveUrl,

      codec:
        "h264",

      outputLocation:
        absoluteOutputPath,

      inputProps,

      onProgress: ({
        progress,
      }) => {
        /*
         * Reservamos:
         *
         * 0-5% para preparação
         * 5-99% para o Remotion
         * 100% para conclusão.
         */

        const percentage =
          Math.min(
            99,
            Math.max(
              5,
              Math.round(
                5 +
                  progress *
                    94
              )
            )
          );

        /*
         * Não fazemos UPDATE
         * a cada frame.
         *
         * Apenas quando muda pelo
         * menos 2 pontos percentuais.
         */

        if (
          percentage -
            lastSavedProgress <
          2
        ) {
          return;
        }

        lastSavedProgress =
          percentage;

        void prisma.render
          .update({
            where: {
              id:
                renderId,
            },

            data: {
              progress:
                percentage,
            },
          })
          .catch(
            (error) => {
              console.error(
                "Erro ao atualizar progresso:",
                error
              );
            }
          );
      },
    });

    /*
     * =====================================================
     * CONCLUÍDO
     * =====================================================
     */

    const normalizedOutputPath =
      relativeOutputPath.replace(
        /\\/g,
        "/"
      );

    await prisma.render.update({
      where: {
        id: renderId,
      },

      data: {
        status:
          "COMPLETED",

        progress:
          100,

        outputPath:
          normalizedOutputPath,

        completedAt:
          new Date(),

        errorMessage:
          null,
      },
    });

    console.log(
      `✅ Render concluído: ${normalizedOutputPath}`
    );

    return {
      outputPath:
        normalizedOutputPath,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro desconhecido durante a renderização.";

    /*
     * Se inclusive este update
     * falhar, preservamos o erro
     * original no console.
     */

    try {
      await prisma.render.update({
        where: {
          id: renderId,
        },

        data: {
          status:
            "FAILED",

          errorMessage:
            message,

          completedAt:
            new Date(),
        },
      });
    } catch (
      updateError
    ) {
      console.error(
        "Erro ao registrar falha do render:",
        updateError
      );
    }

    console.error(
      "❌ Erro durante o render:",
      error
    );

    throw error;
  }
}