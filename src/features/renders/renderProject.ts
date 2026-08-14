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
} from "../../database/prisma";

import {
  getProjectForRender,
} from "../projects/getProjectForRender";

type RenderProjectResult = {
  outputPath: string;
};

export async function renderProject(
  projectId: string
): Promise<RenderProjectResult> {
  console.log("");

  console.log(
    "🎬 Preparando projeto para renderização..."
  );

  /*
   * BUSCA CONFIGURAÇÃO DO PROJETO
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

        width: true,

        height: true,
      },
    });

  if (!project) {
    throw new Error(
      `Projeto não encontrado: ${projectId}`
    );
  }

  /*
   * PROPS PARA O REMOTION
   */

  const inputProps =
    await getProjectForRender(
      projectId
    );

  console.log(
    `📚 Projeto: ${inputProps.title}`
  );

  console.log(
    `❓ Perguntas: ${inputProps.questions.length}`
  );

  console.log(
    `📐 Formato: ${project.format}`
  );

  /*
   * ESCOLHE A COMPOSIÇÃO
   */

  const compositionId =
    project.format ===
    "HORIZONTAL"
      ? "QuizHorizontal"
      : "QuizVertical";

  console.log(
    `🎞️ Composição: ${compositionId}`
  );

  /*
   * BUNDLE
   */

  console.log("");

  console.log(
    "📦 Preparando bundle do Remotion..."
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

  console.log(
    "✅ Bundle pronto."
  );

  /*
   * SELECIONA COMPOSIÇÃO
   */

  console.log("");

  console.log(
    "🎞️ Calculando composição..."
  );

  const composition =
    await selectComposition({
      serveUrl,

      id:
        compositionId,

      inputProps,
    });

  console.log(
    `⏱️ Frames: ${composition.durationInFrames}`
  );

  console.log(
    `🎥 Resolução: ${composition.width}x${composition.height}`
  );

  console.log(
    `⚡ FPS: ${composition.fps}`
  );

  /*
   * NOME DO ARQUIVO
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
      );

  const formatSuffix =
    project.format ===
    "HORIZONTAL"
      ? "horizontal"
      : "vertical";

  const outputPath =
    path.resolve(
      process.cwd(),

      "storage",

      "renders",

      `${safeTitle}-${formatSuffix}-${Date.now()}.mp4`
    );

  /*
   * RENDER
   */

  console.log("");

  console.log(
    "🚀 Iniciando renderização..."
  );

  await renderMedia({
    composition,

    serveUrl,

    codec:
      "h264",

    outputLocation:
      outputPath,

    inputProps,

    onProgress: ({
      progress,
    }) => {
      const percentage =
        Math.round(
          progress *
            100
        );

      process.stdout.write(
        `\rRenderizando: ${percentage}%`
      );
    },
  });

  console.log("");

  console.log("");

  console.log(
    "✅ Vídeo renderizado!"
  );

  console.log(
    `📁 ${outputPath}`
  );

  return {
    outputPath,
  };
}